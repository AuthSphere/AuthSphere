import crypto from "crypto";

export async function isPasswordPwned(password) {
  const hash = crypto
    .createHash("sha1")
    .update(password)
    .digest("hex")
    .toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    if (!response.ok) {
      console.error(
        "Failed to fetch from pwnedpasswords API:",
        response.statusText,
      );
      return false;
    }

    const text = await response.text();
    const hashes = text.split("\r\n");

    for (const line of hashes) {
      const [h, _count] = line.split(":");
      if (h === suffix) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking pwned passwords:", error);
  }

  return false;
}
