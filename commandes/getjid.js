const { zokou } = require(__dirname + "/../framework/zokou");

zokou({
    nomCom: "getjid",
    categorie: "SPECIAL-CLEAN",
    reaction: "🔍",
    description: "Récupère le JID du groupe ou du chat privé"
}, async (origine, zk, { repondre, auteurMessage }) => {
    try {
        // Vérifier si c'est un groupe ou un chat privé
        const estGroupe = origine.endsWith('@g.us');

        if (estGroupe) {
            // Récupérer les infos du groupe
            const metadata = await zk.groupMetadata(origine);
            
            // Renvoyer uniquement le JID du groupe avec son nom
            repondre(`📌 *JID du groupe* :\n\n🔹 *Nom* : ${metadata.subject}\n🔹 *ID* : \`${origine}\`\n🔹 *Participants* : ${metadata.participants.length} membres`);

        } else {
            // Chat privé : renvoyer le JID de l'utilisateur
            const jidAuteur = auteurMessage.replace(/@.+/, '@whatsapp.net');
            repondre(`🔍 *Chat privé avec* : \`${jidAuteur}\``);
        }

    } catch (e) {
        repondre("❌ Erreur : Impossible de récupérer le JID.\n" + e.message);
        console.error("Erreur dans getjid :", e);
    }
});