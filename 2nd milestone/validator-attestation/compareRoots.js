const onChainRootStr = "397338260255721648337439624044829523171880033905820567689549048980874981472";
const offChainRootStr = "7365097960613377897691174235158337018925123723593134630958996251478884188975";

try {
  const onChainRoot = BigInt(onChainRootStr);
  const offChainRoot = BigInt(offChainRootStr);

  if (onChainRoot === offChainRoot) {
    console.log("✅ Roots MATCH exactly.");
  } else {
    console.log("❌ Roots DIFFER.");
    console.log("On-chain root:  ", onChainRoot.toString());
    console.log("Off-chain root: ", offChainRoot.toString());
  }
} catch (error) {
  console.error("Error parsing root strings as BigInt:", error);
}