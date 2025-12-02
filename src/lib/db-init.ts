import { AppDataSource } from "./data-source";

export async function ensureDataSourceInitialized() {

  
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();


  }
}
