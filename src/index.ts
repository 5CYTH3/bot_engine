import {
	Client,
	CommandInteraction,
	IntentsBitField,
	REST,
	Routes,
	SlashCommandBuilder,
} from 'discord.js'

type BotSpecs = { token: string; CLIENT_ID: string; }

export class Bot extends Client {
	private specs: BotSpecs

	private commands: {
		data: SlashCommandBuilder
		execute(interaction: CommandInteraction): Promise<void>
	}[] = []

	constructor(botSpecs: BotSpecs) {
		super({
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMembers,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.MessageContent,
			],
		});
		this.specs = botSpecs
	}

	public run() {
		super.login(this.specs.token)
	}

	public async registerCommands() {
		let rest = new REST({ version: '10' }).setToken(this.specs.token)
		await rest.put(
			Routes.applicationCommands(
				this.specs.CLIENT_ID
			),
			{
				body: this.commands,
			}
		)
	}
}
