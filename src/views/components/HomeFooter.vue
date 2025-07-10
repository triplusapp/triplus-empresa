<template>
  <footer>
    <div class="footer-logos">
      <div class="item" style="padding-left: 18px;">{{ $t('home.footer.promoted_by') }}</div>
      <div class="item"></div>
      <div class="item">{{ $t('home.footer.financed_by') }}</div>
      <div class="item">
        <img src="/assets/economia-social.png" alt="economia social">
      </div>
      <div class="item"><img src="/assets/generalitat-empresa-treball.png" alt="Generalitat de Catalunya"></div>
      <div class="item">
        <img src="/assets/ministerio.jpg" alt="ministerio">
      </div>
    </div>
    <div>
      {{ $t('home.footer.promoted_and_financed_by_text') }}
    </div>
  </footer>
</template>

<style scoped>
footer {
  align-items: center;
  display: flex;
  font-size: 0.85rem;
  flex-direction: column;
  padding-bottom: 1.5rem;
}

.footer-logos img {
  max-width: 100%;
  width: 180px;
  height: auto;
}

.footer-logos {
  max-width: 700px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 0 20px;
}

.footer-logos .item {
  display: flex;
  align-items: center;
}

</style>

