(() => {
  "use strict";

  /* =========================================================
     UTILIDADES
     ========================================================= */

  const $ = (selector) => document.querySelector(selector);

  const $$ = (selector) => [
    ...document.querySelectorAll(selector)
  ];

  /* =========================================================
     ESCENAS
     ========================================================= */

  const scenes = {
    logo: $("#scene-logo"),
    loading: $("#scene-loading"),
    welcome: $("#scene-welcome"),
    lights: $("#scene-lights"),
    invitation: $("#scene-invitation"),
  };

  let currentScene = "logo";
  let started = false;

  /* =========================================================
     AUDIO
     ========================================================= */

  let audioContext = null;
  let soundOn = false;

  /* =========================================================
     DATOS DE LAS 15 LUCES
     ========================================================= */

  const values = [
    {
      number: 1,
      title: "Gratitud",
      description:
        "Honramos a quienes nos han acompañado y han hecho posible nuestra historia.",
    },

    {
      number: 2,
      title: "Respeto",
      description:
        "Reconocemos el valor de cada persona y construimos relaciones basadas en la consideración y la dignidad.",
    },

    {
      number: 3,
      title: "Empatía",
      description:
        "Comprendemos al otro, escuchamos sus necesidades y nos acercamos desde la sensibilidad humana.",
    },

    {
      number: 4,
      title: "Vocación de servicio",
      description:
        "Ponemos nuestro conocimiento y compromiso al servicio de quienes confían en nosotros.",
    },

    {
      number: 5,
      title: "Integridad",
      description:
        "Actuamos con coherencia, transparencia y responsabilidad en cada decisión.",
    },

    {
      number: 6,
      title: "Templanza",
      description:
        "Cultivamos el equilibrio, la serenidad y el buen juicio incluso ante los desafíos.",
    },

    {
      number: 7,
      title: "Solidaridad",
      description:
        "Entendemos que juntos podemos acompañar, apoyar y generar un impacto mayor.",
    },

    {
      number: 8,
      title: "Confianza",
      description:
        "Construimos vínculos sólidos a partir de la transparencia, el compromiso y la credibilidad.",
    },

    {
      number: 9,
      title: "Unidad",
      description:
        "Trabajamos como un equipo que comparte un propósito y una misma visión.",
    },

    {
      number: 10,
      title: "Humildad",
      description:
        "Reconocemos que siempre podemos aprender, mejorar y crecer junto a los demás.",
    },

    {
      number: 11,
      title: "Generosidad",
      description:
        "Compartimos nuestro tiempo, conocimiento y capacidades para contribuir al bienestar de otros.",
    },

    {
      number: 12,
      title: "Lealtad",
      description:
        "Cuidamos los vínculos, los principios y el propósito que nos han acompañado durante estos años.",
    },

    {
      number: 13,
      title: "Valentía",
      description:
        "Nos atrevemos a avanzar, transformar y asumir nuevos retos con determinación.",
    },

    {
      number: 14,
      title: "Perseverancia",
      description:
        "Seguimos adelante con constancia y compromiso hasta convertir los desafíos en oportunidades.",
    },

    {
      number: 15,
      title: "Esperanza",
      description:
        "Miramos hacia el futuro con ilusión, propósito y la convicción de que aún hay mucho por construir.",
    },
  ];

  /* =========================================================
     SECUENCIA INICIAL
     ========================================================= */

  window.addEventListener("load", () => {

    setTimeout(() => {
      transitionTo("loading");
    }, 1900);

    setTimeout(() => {
      transitionTo("welcome");
    }, 4900);

  });

  /* =========================================================
     CAMBIO DE ESCENA
     ========================================================= */

  function transitionTo(name) {

    const next = scenes[name];

    if (!next) {
      console.error(
        `CMC: La escena "${name}" no existe en el HTML.`
      );

      return;
    }

    const current = scenes[currentScene];

    if (name === currentScene) {
      return;
    }

    /*
     * Quitamos la escena actual
     */
    if (current) {
      current.classList.remove("active");

      /*
       * Accesibilidad
       */
      if (
        current.hasAttribute("aria-hidden")
      ) {
        current.setAttribute(
          "aria-hidden",
          "true"
        );
      }
    }

    /*
     * Esperamos un frame para que
     * CSS pueda ejecutar correctamente
     * el crossfade.
     */
    requestAnimationFrame(() => {

      next.classList.add("active");

      if (
        next.hasAttribute("aria-hidden")
      ) {
        next.setAttribute(
          "aria-hidden",
          "false"
        );
      }

    });

    currentScene = name;

  }

  /* =========================================================
     BOTÓN COMENZAR
     ========================================================= */

  $("#begin")?.addEventListener(
    "click",
    () => {

      if (started) {
        return;
      }

      started = true;

      playTone(520, 0.12);

      transitionTo("lights");

      document.dispatchEvent(
        new CustomEvent(
          "cmc:begin",
          {
            detail: {
              scene: "lights",
            },
          }
        )
      );

    }
  );

  /* =========================================================
     15 LUCES
     ========================================================= */

  const candles = $$(".candle");

  const valuePanel =
    $("#valuePanel");

  const valueNumber =
    $("#valueNumber");

  const valueTitle =
    $("#valueTitle");

  const valueDescription =
    $("#valueDescription");

  const litCount =
    $("#litCount");

  let litCandles = 0;

  /*
   * Asociamos cada vela con su valor
   */
  candles.forEach(
    (candle, index) => {

      const value =
        values[index];

      if (!value) {
        return;
      }

      candle.dataset.value =
        value.number;

      candle.dataset.title =
        value.title;

      candle.addEventListener(
        "click",
        () => {

          lightCandle(
            candle,
            value
          );

        }
      );

    }
  );

  /* =========================================================
     ENCENDER VELA
     ========================================================= */

  function lightCandle(
    candle,
    value
  ) {

    /*
     * Si ya estaba encendida,
     * solamente mostramos nuevamente
     * su información.
     */
    if (
      candle.classList.contains("lit")
    ) {

      showValue(value);

      return;

    }

    /*
     * Encender visualmente
     */
    candle.classList.add("lit");

    litCandles += 1;

    updateCounter();

    showValue(value);

    /*
     * Sonido ligeramente diferente
     * para cada vela
     */
    playTone(
      500 + litCandles * 14,
      0.12
    );

    /*
     * Evento personalizado
     */
    document.dispatchEvent(
      new CustomEvent(
        "cmc:candle-lit",
        {
          detail: {
            number:
              value.number,

            title:
              value.title,

            count:
              litCandles,

            total:
              values.length,
          },
        }
      )
    );

    /*
     * Si ya están las 15...
     */
    if (
      litCandles ===
      values.length
    ) {

      completeLights();

    }

  }

  /* =========================================================
     ACTUALIZAR CONTADOR
     ========================================================= */

  function updateCounter() {

    if (!litCount) {
      return;
    }

    litCount.textContent =
      litCandles;

  }

  /* =========================================================
     MOSTRAR INFORMACIÓN DEL VALOR
     ========================================================= */

  function showValue(value) {

    if (
      !valuePanel ||
      !valueNumber ||
      !valueTitle ||
      !valueDescription
    ) {

      return;

    }

    /*
     * Si el panel ya está visible,
     * hacemos una pequeña transición
     * de contenido.
     */
    if (
      valuePanel.classList.contains(
        "visible"
      )
    ) {

      valuePanel.classList.remove(
        "visible"
      );

      setTimeout(
        () => {

          updateValueContent(
            value
          );

          valuePanel.classList.add(
            "visible"
          );

          valuePanel.setAttribute(
            "aria-hidden",
            "false"
          );

        },
        180
      );

      return;

    }

    updateValueContent(value);

    requestAnimationFrame(
      () => {

        valuePanel.classList.add(
          "visible"
        );

        valuePanel.setAttribute(
          "aria-hidden",
          "false"
        );

      }
    );

  }

  /* =========================================================
     ACTUALIZAR CONTENIDO DEL PANEL
     ========================================================= */

  function updateValueContent(
    value
  ) {

    valueNumber.textContent =
      value.number;

    valueTitle.textContent =
      value.title;

    valueDescription.textContent =
      value.description;

  }

  /* =========================================================
     COMPLETAR LAS 15 LUCES
     ========================================================= */

  function completeLights() {

    /*
     * Esperamos 3 segundos después
     * de encender la última vela.
     */
    setTimeout(
      () => {

        /*
         * Evento para futuras animaciones
         * de partículas / celebración.
         */
        document.dispatchEvent(
          new CustomEvent(
            "cmc:lights-complete",
            {
              detail: {
                total:
                  litCandles,
              },
            }
          )
        );

        /*
         * Pasamos directamente
         * a la invitación.
         */
        transitionTo(
          "invitation"
        );

      },
      3000
    );

  }

  /* =========================================================
     BOTÓN DE SONIDO
     ========================================================= */

  $("#soundToggle")?.addEventListener(
    "click",
    async () => {

      soundOn = !soundOn;

      const button =
        $("#soundToggle");

      if (!button) {
        return;
      }

      button.textContent =
        soundOn
          ? "♫"
          : "♪";

      button.setAttribute(
        "aria-label",
        soundOn
          ? "Desactivar sonido"
          : "Activar sonido"
      );

      if (soundOn) {

        try {

          audioContext ??=
            new (
              window.AudioContext ||
              window.webkitAudioContext
            )();

          await audioContext.resume();

          playTone(
            660,
            0.18
          );

        } catch (error) {

          console.warn(
            "CMC: Audio no disponible.",
            error
          );

        }

      }

    }
  );

  /* =========================================================
     REPRODUCIR TONO
     ========================================================= */

  function playTone(
    frequency,
    duration
  ) {

    if (!soundOn) {
      return;
    }

    try {

      audioContext ??=
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.type =
        "sine";

      oscillator.frequency.value =
        frequency;

      const now =
        audioContext.currentTime;

      gain.gain.setValueAtTime(
        0.0001,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.025,
        now + 0.018
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
      );

      oscillator.connect(
        gain
      );

      gain.connect(
        audioContext.destination
      );

      oscillator.start(now);

      oscillator.stop(
        now +
        duration +
        0.03
      );

    } catch (error) {

      console.warn(
        "CMC: No fue posible reproducir el sonido.",
        error
      );

    }

  }

  /* =========================================================
     BOTÓN — CONFIRMAR ASISTENCIA
     ========================================================= */

  const attendanceButton =
    $("#attendanceButton");

  const attendanceFormSection =
    $("#attendanceFormSection");

  attendanceButton?.addEventListener(
    "click",
    () => {

      if (
        !attendanceFormSection
      ) {
        return;
      }

      /*
       * Mostrar formulario
       */
      attendanceFormSection.classList.add(
        "visible"
      );

      attendanceFormSection.setAttribute(
        "aria-hidden",
        "false"
      );

      /*
       * Llevar el scroll hasta
       * el formulario
       */
      setTimeout(
        () => {

          attendanceFormSection.scrollIntoView(
            {
              behavior:
                "smooth",
              block:
                "start",
            }
          );

        },
        100
      );

    }
  );

  /* =========================================================
     FORMULARIO DE ASISTENCIA
     ========================================================= */

 const attendanceForm =
  $("#attendanceForm");

const MICROSOFT_FORM_URL =
  "https://forms.cloud.microsoft/r/2DtwjukAjA?origin=lprLink";

attendanceForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    /*
     * Llevar al usuario al
     * formulario oficial de Microsoft Forms.
     */
    window.location.href =
      MICROSOFT_FORM_URL;

  }
);

  /* =========================================================
     CONFIRMACIÓN DEL FORMULARIO
     ========================================================= */

  function showAttendanceSuccess() {

    if (
      !attendanceForm
    ) {
      return;
    }

    attendanceForm.innerHTML = `
      <div class="attendance-success">

        <span class="success-symbol">
          ✦
        </span>

        <h3>
          Gracias por confirmar.
        </h3>

        <p>
          Hemos recibido tu información.
          Nos encantará compartir contigo
          este momento tan especial.
        </p>

      </div>
    `;

  }

  /* =========================================================
     BOTÓN — CALENDARIO
     ========================================================= */

  $("#calendarButton")?.addEventListener(
    "click",
    () => {

      /*
       * Evento:
       * 6 de diciembre de 2026
       *
       * Eucaristía:
       * 3:00 p. m.
       *
       * Cóctel:
       * 5:00 p. m.
       *
       * Se genera un archivo ICS
       * compatible con calendarios.
       */

      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//CMC//15 Anos//ES",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "UID:cmc-15-anos-2026@cmc",
        "DTSTAMP:20261123T000000Z",
        "DTSTART:20261206T150000",
        "DTEND:20261206T190000",
        "SUMMARY:CMC · 15 años",
        "DESCRIPTION:Eucaristía de acción de gracias a las 3:00 p. m. en Iglesia Torcoroma y cóctel de aniversario a las 5:00 p. m. en Hotel Movich.",
        "LOCATION:Barranquilla, Colombia",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob =
        new Blob(
          [ics],
          {
            type:
              "text/calendar;charset=utf-8",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "CMC-15-anios-2026.ics";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setTimeout(
        () => {
          URL.revokeObjectURL(
            url
          );
        },
        1000
      );

    }
  );

  /* =========================================================
     BOTÓN — COMPARTIR INVITACIÓN
     ========================================================= */

  $("#shareButton")?.addEventListener(
    "click",
    async () => {

      const shareData = {
        title:
          "CMC · 15 años",

        text:
          "Te invitamos a celebrar con nosotros los 15 años de Centro Médico Cognitivo e Investigación.",

        url:
          window.location.href,
      };

      /*
       * Si el navegador soporta
       * Web Share API
       */
      if (
        navigator.share
      ) {

        try {

          await navigator.share(
            shareData
          );

          return;

        } catch (error) {

          /*
           * Si el usuario cancela,
           * no hacemos nada.
           */
          if (
            error.name ===
            "AbortError"
          ) {

            return;

          }

        }

      }

      /*
       * Alternativa:
       * copiar enlace.
       */
      try {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert(
          "Enlace de la invitación copiado."
        );

      } catch (error) {

        alert(
          "Puedes compartir esta invitación copiando la dirección de esta página."
        );

      }

    }
  );

  /* =========================================================
     PROTECCIÓN CONTRA ERRORES
     ========================================================= */

  console.log(
    "CMC · Invitación de 15 años inicializada correctamente."
  );

})();