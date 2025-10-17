import { ConsoleLogger, Injectable } from '@nestjs/common'
import * as fs from "fs"
import { promises as fsPromises } from "fs"
import * as path from "path"

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
    async logToFile(entry: string) {
        const formattedEntry = `${new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Halifax'
        }).format(new Date())}\t${entry}\n`

        try {
            if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
                await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
            }
            const logFileName = path.join(__dirname, '..', '..', 'logs', 'logFile.log')
            await fsPromises.appendFile(logFileName, formattedEntry)
        } catch (error) {
            console.log('ERROR IN THE ERROR LOGGER')
            if (error instanceof Error) console.log(error.message)
        }
    }

    private getCallerContext(): string {
        const stack = new Error().stack;
        if (stack) {
            // Parse stack trace to find the caller
            const stackLines = stack.split('\n');
            // stackLines[0] is "Error"
            // stackLines[1] is this getCallerContext method
            // stackLines[2] is the log/error method
            // stackLines[3] is the actual caller
            const callerLine = stackLines[3];
            const match = callerLine?.match(/at\s+(\w+)\./);
            return match ? match[1] : 'anonymous';
        }
        return 'anonymous';
    }

    log(message: any, context?: string) {
        // If no context provided, try to get the caller class name from stack trace
        if (!context) {
            context = this.getCallerContext();
        }
        
        const entry = `${context}\t${message}`
        this.logToFile(entry)
        super.log(message, context)
    }

    error(message: any, stackOrContext?: string) {
        // If no context provided, try to get the caller class name from stack trace
        if (!stackOrContext) {
            stackOrContext = this.getCallerContext();
        }
        
        const entry = `${stackOrContext}\t${message}`
        this.logToFile(entry)
        super.error(message, stackOrContext)
    }
}
