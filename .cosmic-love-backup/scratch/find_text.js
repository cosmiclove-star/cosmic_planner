const fs = require('fs');
const readline = require('readline');

async function search() {
  const fileStream = fs.createReadStream('C:/Users/Crispis/.gemini/antigravity-ide/brain/c3cfa7bc-07a0-4c4a-9c1f-d140d25da687/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.toLowerCase().includes('feria') && line.toLowerCase().includes('boutique')) {
      console.log(`Line ${lineCount}: matched feria & boutique`);
      // print matching snippets
      const index = line.toLowerCase().indexOf('boutique');
      const start = Math.max(0, index - 100);
      const end = Math.min(line.length, index + 300);
      console.log('Snippet:', line.substring(start, end));
    }
  }
}

search().catch(console.error);
