<script setup>
import { NCard } from "naive-ui";
</script>

<template>
  <div class="docs">
    <n-card>
      General guides to MX Software
      <br />
      <a
        target="_blank"
        href="https://www.psi.ch/en/sls/pxi/mx-software-documentation"
        class="alert-link"
        >MX Software Documentation</a
      >
    </n-card>
    <n-card>
      Beamline Calendars
      <br />
      <div class="container">
        <a
          target="_blank"
          href="https://duo.psi.ch/duo/public_calendar.php?BEAMLINE=PX&POS=4045&CBLIND=&LAYOUT="
          class="alert-link"
          >PXI</a
        >
        <br />
        <a
          target="_blank"
          href="https://duo.psi.ch/duo/public_calendar.php?BEAMLINE=PXII&POS=4045&CBLIND=&LAYOUT="
          class="alert-link"
          >PXII</a
        >
        <br />
        <a
          target="_blank"
          href="https://duo.psi.ch/duo/public_calendar.php?BEAMLINE=PXIII&POS=4045&CBLIND=&LAYOUT="
          class="alert-link"
          >PXIII</a
        >
      </div>
    </n-card>
    <n-card>
      Import Guidelines & Shipping Instructions
      <br />
      <a
        class="alert-link"
        target="_blank"
        href="http://www.psi.ch/useroffice/importshipping"
      >
        PSI Shipping Guidelines & Instructions
      </a>
    </n-card>
    <n-card>
      Large Volume SLS/SwissFEL Data Transfer
      <br />
      <a
        class="alert-link"
        target="_blank"
        href="https://www.psi.ch/en/photon-science-data-services/slsswissfel-data-transfer"
      >
        SLS Data Transfer Instructions
      </a>
    </n-card>
  </div>
</template>

<style scoped>
.docs {
  display: grid;
  gap: 16px;
  justify-content: center;
}

.container {
  display: flex;
  max-width: 100vw;
  margin-bottom: 1em;
  justify-content: space-evenly;
}
</style>
