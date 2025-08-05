import { Client, GatewayIntentBits, Partials, PermissionsBitField } from 'discord.js';
import fs from 'fs';

// Đọc config
const { token, prefix } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

// Tạo client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Khi bot online
client.once('ready', () => {
  console.log(`✅ Bot đã online: ${client.user.tag}`);
});

// Xử lý lệnh
client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;

  // Nếu không bắt đầu bằng prefix thì bỏ qua
  if (!message.content.startsWith(prefix)) return;

  const [cmd] = message.content.slice(prefix.length).split(/\s+/);

  if (cmd === 'remove') {
    // Kiểm tra quyền
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageEmojisAndStickers)) {
      return message.reply('❌ Bạn cần quyền **Manage Emojis and Stickers** để dùng lệnh này.');
    }

    try {
      const emojis = await message.guild.emojis.fetch();

      if (emojis.size === 0) {
        return message.reply('✅ Server này không có emoji nào.');
      }

      await Promise.all(emojis.map(e => e.delete().catch(() => null)));

      message.reply(`🗑️ Đã xoá **${emojis.size} emoji** trong server.`);
    } catch (err) {
      console.error('💥 Lỗi xoá emoji:', err);
      message.reply('⚠️ Đã xảy ra lỗi khi xoá emoji.');
    }
  }
});

// Đăng nhập bot
client.login(token);
