const { zokou } = require(__dirname + "/../framework/zokou");
zokou({

    nomCom: "love_msg",
  
    categorie: "FAMOUS-TECH-PLUGINS🇭🇹",
  
    reaction: "❤️",
  
    desc: "Génère des messages d'amour personnalisés.",
  
    alias: ["lovemsg"]
  
  }, async (origineMessage, zk, commandeOptions) => {
  
    const { arg, repondre } = commandeOptions;
  
    if (!arg[0]) {
  
      return repondre("❌ Usage: .love_msg <genre> [style: poétique/simple/drôle]");
  
    }
  
    try {
  
      const genre = arg[0].toLowerCase();
  
      const style = arg[1]?.toLowerCase() || "simple";
  
      const messages = {
  
        fille: {
  
          poétique: [
  
            "Ton amour est comme un jardin de roses éternelles, chaque pétale conte notre histoire.",
  
            "Dans l'océan de mes pensées, tu es la plus belle des sirènes.",
  
            "Tes yeux sont les étoiles qui guident mon chemin dans la nuit."
  
          ],
  
          simple: [
  
            "Tu es la plus belle chose qui me soit arrivée.",
  
            "Chaque jour passé avec toi est un cadeau précieux.",
  
            "Tu illumines ma vie par ta simple présence."
  
          ],
  
          drôle: [
  
            "Si tu étais une pizza, tu serais ma préférée ! 🍕",
  
            "Es-tu un ange ? Car tu as fait chavirer mon cœur ! 😇",
  
            "Tu es comme le WiFi - je ne peux pas vivre sans toi ! 📶"
  
          ]
  
        },
  
        garçon: {
  
          poétique: [
  
            "Tu es le héros de mon histoire d'amour, le prince de mes rêves.",
  
            "Dans le livre de ma vie, tu es le plus beau chapitre.",
  
            "Ton amour est mon refuge, mon havre de paix."
  
          ],
  
          simple: [
  
            "Tu es l'homme de ma vie, mon roc, mon tout.",
  
            "Avec toi, chaque moment devient magique.",
  
            "Tu es mon bonheur quotidien."
  
          ],
  
          drôle: [
  
            "Tu es comme mon café du matin - impossible de commencer la journée sans toi ! ☕",
  
            "Es-tu Superman ? Car tu as des super-pouvoirs sur mon cœur ! 🦸‍♂️",
  
            "Si tu étais un jeu vidéo, tu serais mon préféré ! 🎮"
  
          ]
  
        }
  
      };
  
      if (!messages[genre]) {
  
        throw new Error("Genre non reconnu. Choisissez 'fille' ou 'garçon'");
  
      }
  
      if (!messages[genre][style]) {
  
        throw new Error("Style non reconnu. Choisissez 'poétique', 'simple' ou 'drôle'");
  
      }
  
      const selectedMessages = messages[genre][style];
  
      const message = utils.randomFromArray(selectedMessages);
  
      const response = utils.formatResponse("Message d'Amour",
  
        `💝 Genre: ${genre}\n` +
  
        `✨ Style: ${style}\n\n` +
  
        `${message}`
  
      );
  
      repondre(response);
  
    } catch (error) {
  
      repondre(`❌ Erreur: ${error.message}`);
  
    }
  
  });
  
  // Commande d'auteur améliorée
  
  zokou({
  
    nomCom: "famous-tech",
  
    categorie: "FAMOUS-TECH-PLUGINS🇭🇹",
  
    reaction: "💫",
  
    desc: "Informations sur l'auteur et le projet.",
  
    alias: ["ft"]
  
  }, async (origineMessage, zk, commandeOptions) => {
  
    const { repondre } = commandeOptions;
  
    const response = utils.formatResponse("Famous Tech",
  
      `👨‍💻 *Créateur*\n` +
  
      `• Nom: Famous Tech\n` +
  
      `• Rôle: Collaborateur externe\n\n` +
  
      `📱 *Contact*\n` +
  
      `• WhatsApp: +50943782508\n` +
  
      `• Email: famoustechgroup@proton.me\n\n` +
  
      `🌐 *Sites Web*\n` +
  
      `• Mon site web : www.famoustech.biz.id\n\n` +

      `• Mon Portfolio : me.famoustech.biz.id\n\n` +     
  
      `📦 *Projet*\n` +
  
      `• Nom de catégorie: FAMOUS-TECH-PLUGINS\n` +
  
      `• Version: 2.0.0\n` +
  
      `• Licence: MIT\n\n` +
  
      `💡 *Support*\n` +
  
      `Pour toute question ou suggestion, n'hésitez pas à me contacter !`
  
    );
  
    repondre(response);
  
  });
  