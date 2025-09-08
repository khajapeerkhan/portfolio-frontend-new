"use client";
import { useState, useEffect } from "react";

export default function AIAssistant() {
  const [isBotpressLoaded, setBotpressLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v3.2/inject.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => setBotpressLoaded(true);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isBotpressLoaded && window.botpress) {
      window.botpress.init({
        botId: "faf463d5-70ec-49ed-92ba-250370fd801e",
        clientId: "16167025-1ffc-4820-91d2-580065f8b1bf",
        selector: "#webchat",
        configuration: {
          version: "v2",
          botName: "Khajaeer Khan's-🤖",
          botDescription: "",
          website: {},
          email: {},
          phone: {},
          termsOfService: {},
          privacyPolicy: {},
          color: "#3276EA",
          variant: "solid",
          headerVariant: "glass",
          themeMode: "light",
          fontFamily: "inter",
          radius: 4,
          feedbackEnabled: false,
          footer: "[🛠 by Khajapeer Khan](www.linkedin.com/in/pathan-mohammed-khajapeer-khan-9348b7276)",
        },
      });
      window.botpress.on("webchat:ready", () => {
        window.botpress.open();
      });
    }
  }, [isBotpressLoaded]);

  return (
    <div
      id="webchat"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "360px",
        height: "480px",
        zIndex: 1000,
      }}
    >
      <style jsx>{`
        #webchat .bpFab {
          display: none;
        }
        #webchat .bpWebchat {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
