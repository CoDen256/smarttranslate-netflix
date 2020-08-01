const replaceWithSpans = (sentence, id, cl) => sentence.replace(/([a-zäüöß'\-]+)/gi, '<span id="'+id+'" class='+cl+'>$1</span>');
const pixel = (any) => any.toString() + "px";
const toClass = (any) => "." + any;
const toId = (any) => "#" + any;

export {replaceWithSpans, pixel, toClass, toId}