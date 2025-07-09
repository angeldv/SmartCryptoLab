// src/main.js
/**
 * Main entry point for SmartCryptoLab application
 */

const { Processor } = require('./core');
const { transform } = require('./utils');
const logger = require('./logger');

class SmartCryptoLab {
    /**
     * Create a new SmartCryptoLab instance
     * @param {object} config Configuration options
     * @param {string} [config.input] Input file path
     * @param {string} [config.output] Output file path
     * @param {boolean} [config.verbose=false] Enable verbose logging
     */
    constructor(config = {}) {
        this.config = {
            verbose: false,
            ...config
        };
        
        if (this.config.verbose) {
            logger.enableDebug();
        }
        
        this.processor = new Processor(this.config);
    }
    
    /**
     * Execute the processing pipeline
     * @returns {Promise<any>} Processing result
     */
    async execute() {
        try {
            logger.info(`Starting ${this.constructor.name}`);
            const result = await this.processor.run();
            logger.info('Processing completed successfully');
            return result;
        } catch (error) {
            logger.error(`Processing failed: ${error.message}`);
            throw error;
        }
    }
}

// Export for module usage
module.exports = SmartCryptoLab;

// CLI implementation
if (require.main === module) {
    const args = require('minimist')(process.argv.slice(2), {
        boolean: ['verbose'],
        alias: {
            i: 'input',
            o: 'output',
            v: 'verbose'
        }
    });
    
    const app = new SmartCryptoLab({
        input: args.input,
        output: args.output,
        verbose: args.verbose
    });
    
    app.execute().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
