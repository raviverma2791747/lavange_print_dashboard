<div class="flex justify-center items-center min-h-[calc(100vh-64px)]">
  <div class="flex flex-col justify-between items-center">
    <div class="loader h-24"></div>
    <div class="text-3xl font-semibold">404 Not Found!</div>
  </div>
</div>

<style>
  .loader {
    position: relative;
    width: 108px;
    display: flex;
    justify-content: space-between;
  }
  .loader::after,
  .loader::before {
    content: "";
    display: inline-block;
    width: 48px;
    height: 48px;
    background-color: #fff;
    background-image: radial-gradient(circle 14px, #0d161b 100%, transparent 0);
    background-repeat: no-repeat;
    border-radius: 50%;
    animation:
      eyeMove 10s infinite,
      blink 10s infinite;
  }
  @keyframes eyeMove {
    0%,
    10% {
      background-position: 0px 0px;
    }
    13%,
    40% {
      background-position: -15px 0px;
    }
    43%,
    70% {
      background-position: 15px 0px;
    }
    73%,
    90% {
      background-position: 0px 15px;
    }
    93%,
    100% {
      background-position: 0px 0px;
    }
  }
  @keyframes blink {
    0%,
    10%,
    12%,
    20%,
    22%,
    40%,
    42%,
    60%,
    62%,
    70%,
    72%,
    90%,
    92%,
    98%,
    100% {
      height: 48px;
    }
    11%,
    21%,
    41%,
    61%,
    71%,
    91%,
    99% {
      height: 18px;
    }
  }
</style>
