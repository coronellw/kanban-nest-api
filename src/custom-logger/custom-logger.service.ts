import { ConsoleLogger, Injectable } from '@nestjs/common'
import * as fs from "fs"
import { promises as fsPromises } from "fs"
import * as path from "path"

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
    async logToFile(entry: string) {
        const formattedEntry = `${Intl.DateTimeFormat('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Halifax'
        }).format(new Date())}\t${entry}\n`

        try {
            if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
                await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
            }
            const logFileName = path.join(__dirname, '..', '..', 'logs', 'logFile.log')
            await fsPromises.appendFile(logFileName, formattedEntry)
        } catch (error) {
            if (error instanceof Error) console.log(error.message)
        }
    }

    log(message: any, context?: string) {
        const entry = `${context}\t${message}`
        this.logToFile(entry)
        super.log(message, context)
    }

    error(message: any, stackOrContext?: string) {
        const entry = `${stackOrContext}\t${message}`
        this.logToFile(entry)
        super.error(message, stackOrContext)
    }
}
