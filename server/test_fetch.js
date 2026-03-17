const fs = require('fs');
async function test() {
  const res = await fetch("http://localhost:5000/api/meetups/69b713d476e8158ad54702a1");
  const data = await res.json();
  fs.writeFileSync("test_fetch_out2.json", JSON.stringify(data, null, 2), "utf8");
}
test();
