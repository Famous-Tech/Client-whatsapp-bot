const { zokou } = require(__dirname + "/../framework/zokou");
const fs = require('fs');

zokou({
  nomCom: "share",
  categorie: "SPECIAL-CLEAN",
  reaction: "🚀",
  description: "Partage un message avec délai de 30s entre chaque envoi"
}, async (origine, zk, { msgRepondu, arg, repondre }) => {
  // Vérifications initiales
  if (!msgRepondu) {
    return repondre("❌ *Répondez à un message à partager.*");
  }

  if (!arg) {
    return repondre("🔍 *Format :* .share JID1 JID2\nEx: .share 123@g.us 229xxxx@s.whatsapp.net");
  }

  // Convertir l'argument en string si ce n'est pas déjà le cas
  const argStr = typeof arg === 'string' ? arg : arg.join(' ');
  
  // Extraire tous les JIDs avec une expression régulière qui accepte les deux formats
  // Format groupe: chiffres@g.us
  // Format privé: chiffres@whatsapp.net OU chiffres@s.whatsapp.net
  const jidRegex = /\b\d+@(g\.us|(s\.)?whatsapp\.net)\b/g;
  const jids = argStr.match(jidRegex) || [];

  if (jids.length === 0) {
    return repondre("❌ *Aucun JID valide.*\nExemples :\n- 123456789@g.us (groupe)\n- 22961234567@whatsapp.net ou 22961234567@s.whatsapp.net (privé)");
  }

  // Afficher les JIDs détectés pour le débogage
  await repondre(`🔄 *${jids.length} JIDs détectés:*\n${jids.join('\n')}`);

  try {
    // Vérifier si le message contient du texte
    let texte = null;
    if (msgRepondu.conversation) {
      texte = msgRepondu.conversation;
    } else if (msgRepondu.extendedTextMessage) {
      texte = msgRepondu.extendedTextMessage.text;
    } else if (msgRepondu.imageMessage && msgRepondu.imageMessage.caption) {
      texte = msgRepondu.imageMessage.caption;
    } else if (msgRepondu.videoMessage && msgRepondu.videoMessage.caption) {
      texte = msgRepondu.videoMessage.caption;
    }

    // Préparation du contenu média
    let contenuMedia = null;
    const mediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage'].find(
      type => msgRepondu[type]
    );

    if (mediaType) {
      const cheminTemp = await zk.downloadAndSaveMediaMessage(msgRepondu[mediaType], 'temp');
      contenuMedia = {
        type: mediaType.replace('Message', ''),
        data: fs.readFileSync(cheminTemp),
        mimetype: msgRepondu[mediaType].mimetype,
        filename: `fichier.${mediaType.replace('Message', '')}`
      };
      
      // Supprimer le fichier temporaire après usage
      fs.unlinkSync(cheminTemp);
    }

    // Normaliser les JIDs privés vers le format standard de Baileys si nécessaire
    const jidsNormalises = jids.map(jid => {
      // Si c'est un JID privé au format @whatsapp.net, le convertir en @s.whatsapp.net
      if (jid.endsWith('@whatsapp.net')) {
        return jid.replace('@whatsapp.net', '@s.whatsapp.net');
      }
      return jid;
    });

    // Envoi avec délai
    let succes = 0;
    for (const [index, jid] of jidsNormalises.entries()) {
      try {
        // Envoi du média si présent
        if (contenuMedia) {
          const mediaOptions = {
            [contenuMedia.type]: contenuMedia.data,
            mimetype: contenuMedia.mimetype
          };
          
          await zk.sendMessage(jid, mediaOptions);
          
          // Si le média avait du texte, envoyer le texte séparément après le média
          if (texte) {
            await zk.sendMessage(jid, { text: texte });
          }
        } else if (texte) {
          // Si pas de média mais du texte, envoyer juste le texte
          await zk.sendMessage(jid, { text: texte });
        }
        
        succes++;
        
        // Informer de la progression
        await repondre(`⏳ Envoi ${index + 1}/${jidsNormalises.length} effectué vers ${jid}`);
        
        // Attendre 30s avant le prochain envoi, sauf pour le dernier
        if (index < jidsNormalises.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      } catch (e) {
        console.error(`Échec pour ${jid}:`, e);
        await repondre(`❌ Échec pour ${jid}: ${e.message}`);
      }
    }

    repondre(`✅ *${succes}/${jidsNormalises.length} envoyés avec succès*`);

  } catch (erreur) {
    repondre(`💥 Erreur critique : ${erreur.message}`);
    console.error("Erreur dans .share :", erreur);
  }
});