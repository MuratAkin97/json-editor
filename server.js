// Function to apply JS code to a JS object
function applyCodeToObject(jsCode, jsObject) {
  try {
    const func = new Function('obj', `with(obj) { ${jsCode}; return obj; }`);
    return func(jsObject);
  } catch (error) {
    return { error: 'Error applying code to object', details: error.message };
  }
}

const server = Bun.serve({
    async fetch (req) {
      const path = new URL(req.url).pathname;
  
      if (path === "/") return new Response("Welcome to Bun!");

      if (req.method === "POST" && path === "/modify-json") {
        const { jsCode, jsObject } = await req.json();
        console.log("Received jsCode and jsObject:", jsCode, jsObject);
        try {
          const modifiedObject = applyCodeToObject(jsCode, jsObject);
          return Response.json({ success: true, modifiedObject });
        } catch (error) {
          console.error("Error applying code to object:", error);
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      }
      // 404s
      return new Response("Page not found", { status: 404 });
    }
  })
  
  console.log(`Listening on ${server.url}`);

