<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  import Quill from "quill";
  //   import '../../node_modules/quill/dist/quill.core.css';
  import "../../node_modules/quill/dist/quill.snow.css";
  import Toolbar from "quill/modules/toolbar";
  import Snow from "quill/themes/snow";

  import Bold from "quill/formats/bold";
  import Italic from "quill/formats/italic";
  import Header from "quill/formats/header";

  // Quill.register({
  //   // "modules/toolbar": Toolbar,
  //  "themes/snow": Snow,
  //   //  "formats/bold": Bold,
  //   // "formats/italic": Italic,
  //    "formats/header": Header,
  // });

  let editor;
  export let content = "";
  export let placeholder = "Start typing here...";

  onMount(async () => {
    var quill = new Quill(editor, {
      theme: "snow",
      modules: {
        // cursors: true,
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          //   ["code-block"],
        ],
        history: {
          // Local undo shouldn’t undo changes made by other users
          userOnly: true,
        },
      },
      placeholder: placeholder,
    });

    quill.clipboard.dangerouslyPasteHTML(content);

    quill.on("text-change", (delta, oldDelta, source) => {
      content = quill.root.innerHTML;
    });
  });
</script>

<div bind:this={editor}></div>
