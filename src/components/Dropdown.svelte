<script>
  //@ts-nocheck
  export let open = false;
</script>

<div class="absolute bottom-0 left-0" class:hidden={!open}>
    <slot/>
</div>
