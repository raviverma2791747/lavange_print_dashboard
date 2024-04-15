<script>
  //@ts-nocheck
  import { onMount } from "svelte";
  //   import '../../node_modules/quill/dist/quill.core.css';
  import "../../node_modules/quill/dist/quill.snow.css";
  // Quill.register({
  //   // "modules/toolbar": Toolbar,
  //  "themes/snow": Snow,
  //   //  "formats/bold": Bold,
  //   // "formats/italic": Italic,
  //    "formats/header": Header,
  // });

  let editor;
  let disabled = false;
  export let content = "";
  export let placeholder = "Start typing here...";
  var quill;

  onMount(async () => {
    const { default: Quill } = await import("quill");
    quill = new Quill(editor, {
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

    quill.enable(!disabled);

    quill.clipboard.dangerouslyPasteHTML(content);

    quill.on("text-change", (delta, oldDelta, source) => {
      content = quill.root.innerHTML;
    });
  });

  $ : {
    console.log(disabled)
    quill?.enable(!disabled);
  }


</script>

<div bind:this={editor}></div>
