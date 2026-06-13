import { ingestNcertFolder } from "../lib/rag/ncertIngestion";

async function main() {
  const result = await ingestNcertFolder(process.argv[2] || "data/ncert/raw");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
