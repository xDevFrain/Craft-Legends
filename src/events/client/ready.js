const joinAndPlayQuran = require('@root/src/utils/functions/joinAndPlayQuran');
const chalk = require('chalk');
const { ActivityType, } = require('discord.js');
const gr = chalk.hex('#00D100');
const un = chalk.underline;

module.exports = {
  name: 'ready',
  /**
   * @param {import("@base/baseClient")} client 
   */
  async execute(client) {

    await client.DBConnect();
    await client.registerInteractions();

    const commands = client.slashCommands.map(({ execute, ...data }) => data);
    setTimeout(() => {
      console.log(gr(`Logged In As ` + un(`${client.user.username}`)));
      console.log(chalk.cyan(`Servers:` + un(`${client.guilds.cache.size}`)), chalk.red(`Users:` + un(`${client.users.cache.size}`)), chalk.blue(`Commands:` + un(` ${client.commands.size}` + ` TOTAL Commands ${client.commands.size + commands.length}`)));
    }, 3000);
    client.user.setStatus("idle")
    client.user.setActivity({ name: `Loading....`, type: ActivityType.Playing })
    setTimeout(() => client.user.setStatus("online"), 40000);
    setInterval(() => {
      let ServersStatus = client.Radio.size
      client.user.setActivity({ name: `in 1 Server`, type: ActivityType.Listening })
    }, 1 * 1000 * 60);

    let RadioChannels = await client.db.table("channels").values() || [];
    if (RadioChannels.length === 0) return
    setTimeout(async () => {

      for (let data of RadioChannels) {
        if (data.enabled) {

          let guild = await client.guilds.fetch(data.guildId)
          if (!guild) continue
          let conn = await joinAndPlayQuran(client, data.channelId, guild, data.url)
          if (conn === null) continue
          if (conn === "cantConnect") continue
          client.Radio.set(data.guildId, conn)
        }

      }
    }, 1000);

  },
};
