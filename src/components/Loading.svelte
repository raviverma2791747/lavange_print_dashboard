<div class="flex h-screen justify-center items-center text-3xl font-semibold">
  <div class="w-16 h-16">
    <span class="loader"></span>
  </div>
</div>

<style>
  .loader {
    width: 48px;
    height: 48px;
    display: inline-block;
    position: relative;
    background: hsl(var(--foreground) / var(--tw-text-opacity));
    box-sizing: border-box;
    animation: flipX 1s linear infinite;
  }

  @keyframes flipX {
    0% {
      transform: perspective(200px) rotateX(0deg) rotateY(0deg);
    }
    50% {
      transform: perspective(200px) rotateX(-180deg) rotateY(0deg);
    }
    100% {
      transform: perspective(200px) rotateX(-180deg) rotateY(-180deg);
    }
  }
</style>
