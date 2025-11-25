import * as fs from 'fs';
import * as path from 'path';

export class FileManager {
    public static salvar<T>(filePath: string, data: T[]): void {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(filePath, jsonData, 'utf-8');
        } catch (error) {
            console.error(`Erro ao salvar dados no arquivo ${filePath}:`, error);
        }
    }

    public static carregar<T>(filePath: string): T[] {
        try {
            if (!fs.existsSync(filePath)) {
                return [];
            }
            
            const fileData = fs.readFileSync(filePath, 'utf-8');
            if (fileData.trim() === '') {
                return [];
            }

            return JSON.parse(fileData) as T[];

        } catch (error) {
            console.error(`Erro ao carregar dados do arquivo ${filePath}:`, error);
            return [];
        }
    }
}