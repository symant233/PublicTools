addEventListener("fetch", (event) => {
  const res = handleRequest(event.request).catch(
    (err) => new Response(err.stack, { status: 500 })
  );
  event.respondWith(res);
});
/**
 * @param {FetchEvent} request
 */
async function handleRequest(request) {
  const path = request.url;
  const index = path.indexOf("dev/?");
  if (index) {
    let res = await fetch(path.slice(index + 5));
    return res;
  }
  return new Response(null);
}
