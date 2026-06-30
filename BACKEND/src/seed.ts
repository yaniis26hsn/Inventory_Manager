import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Product } from './product/product.entity';
import { Transaction } from './transaction/transaction.entity';
import { TransactionItem } from './transactionItem/transactionItem.entity';
import { Provide } from './Provide/provide.entity';
import { ProvideItem } from './provideItem/provideItem.entity';
import { Role } from './common/enums/role.enum';
import { Category } from './common/enums/category.enum';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'inventory_manager',
  entities: [User, Product, Transaction, TransactionItem, Provide, ProvideItem],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const entity of [TransactionItem, ProvideItem, Transaction, Provide, Product, User]) {
    const metadata = AppDataSource.getMetadata(entity);
    await queryRunner.query(`DELETE FROM \`${metadata.tableName}\``);
  }
  await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');

  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);
  const transactionRepo = AppDataSource.getRepository(Transaction);
  const transactionItemRepo = AppDataSource.getRepository(TransactionItem);
  const provideRepo = AppDataSource.getRepository(Provide);
  const provideItemRepo = AppDataSource.getRepository(ProvideItem);

  const users = await userRepo.save([
    { age: 30, role: Role.ADMIN, fname: 'Alice', lname: 'Johnson', username: 'alice', password: 'pass1234' },
    { age: 25, role: Role.WORKER, fname: 'Bob', lname: 'Smith', username: 'bob', password: 'pass1234' },
    { age: 35, role: Role.WORKER, fname: 'Charlie', lname: 'Brown', username: 'charlie', password: 'pass1234' },
    { age: 28, role: Role.PROVIDER, fname: 'Diana', lname: 'Prince', username: 'diana', password: 'pass1234' },
    { age: 40, role: Role.PROVIDER, fname: 'Eve', lname: 'Davis', username: 'eve', password: 'pass1234' },
    { age: 22, role: Role.WORKER, fname: 'Frank', lname: 'Miller', username: 'frank', password: 'pass1234' },
    { age: 33, role: Role.ADMIN, fname: 'Grace', lname: 'Wilson', username: 'grace', password: 'pass1234' },
    { age: 27, role: Role.WORKER, fname: 'Hank', lname: 'Moore', username: 'hank', password: 'pass1234' },
    { age: 45, role: Role.PROVIDER, fname: 'Ivy', lname: 'Taylor', username: 'ivy', password: 'pass1234' },
    { age: 29, role: Role.WORKER, fname: 'Jack', lname: 'Anderson', username: 'jack', password: 'pass1234' },
  ]);

  const products = await productRepo.save([
    { name: 'White Bread', quantity: 50, minQuantity: 20, price: 2, cost: 1, barcode: '10000001', category: Category.FOOD },
    { name: 'Whole Wheat Bread', quantity: 30, minQuantity: 15, price: 3, cost: 1, barcode: '10000002', category: Category.FOOD },
    { name: 'Croissant', quantity: 10, minQuantity: 10, price: 2, cost: 1, barcode: '10000003', category: Category.FOOD },
    { name: 'Bagel', quantity: 25, minQuantity: 10, price: 2, cost: 1, barcode: '10000004', category: Category.FOOD },
    { name: 'Chocolate Cake Slice', quantity: 15, minQuantity: 5, price: 5, cost: 2, barcode: '10000005', category: Category.FOOD },
    { name: 'Cheese Pizza', quantity: 20, minQuantity: 5, price: 8, cost: 3, barcode: '10000006', category: Category.FOOD },
    { name: 'Spring Water 500ml', quantity: 100, minQuantity: 30, price: 1, cost: 1, barcode: '20000001', category: Category.BEVERAGE },
    { name: 'Orange Juice 1L', quantity: 40, minQuantity: 15, price: 4, cost: 2, barcode: '20000002', category: Category.BEVERAGE },
    { name: 'Cola 330ml', quantity: 80, minQuantity: 25, price: 2, cost: 1, barcode: '20000003', category: Category.BEVERAGE },
    { name: 'Green Tea Box', quantity: 35, minQuantity: 10, price: 6, cost: 3, barcode: '20000004', category: Category.BEVERAGE },
    { name: 'Coffee Beans 250g', quantity: 12, minQuantity: 8, price: 10, cost: 5, barcode: '20000005', category: Category.BEVERAGE },
    { name: 'USB-C Cable 2m', quantity: 60, minQuantity: 15, price: 8, cost: 3, barcode: '30000001', category: Category.ELECTRONICS },
    { name: 'Mouse Pad', quantity: 45, minQuantity: 10, price: 5, cost: 2, barcode: '30000002', category: Category.ELECTRONICS },
    { name: 'HDMI Cable 1.5m', quantity: 30, minQuantity: 10, price: 7, cost: 3, barcode: '30000003', category: Category.ELECTRONICS },
    { name: 'Phone Case', quantity: 25, minQuantity: 10, price: 12, cost: 5, barcode: '30000004', category: Category.ELECTRONICS },
    { name: 'Wireless Mouse', quantity: 18, minQuantity: 5, price: 20, cost: 10, barcode: '30000005', category: Category.ELECTRONICS },
    { name: 'T-Shirt Cotton White', quantity: 50, minQuantity: 15, price: 15, cost: 7, barcode: '40000001', category: Category.CLOTHING },
    { name: 'Denim Jeans', quantity: 20, minQuantity: 8, price: 35, cost: 18, barcode: '40000002', category: Category.CLOTHING },
    { name: 'Winter Jacket', quantity: 8, minQuantity: 5, price: 60, cost: 30, barcode: '40000003', category: Category.CLOTHING },
    { name: 'Running Shoes', quantity: 15, minQuantity: 5, price: 50, cost: 25, barcode: '40000004', category: Category.CLOTHING },
    { name: 'Dish Soap 500ml', quantity: 70, minQuantity: 20, price: 3, cost: 1, barcode: '50000001', category: Category.HOUSEHOLD },
    { name: 'Laundry Detergent 1L', quantity: 40, minQuantity: 10, price: 8, cost: 4, barcode: '50000002', category: Category.HOUSEHOLD },
    { name: 'Paper Towels 6-pack', quantity: 55, minQuantity: 15, price: 6, cost: 3, barcode: '50000003', category: Category.HOUSEHOLD },
    { name: 'Trash Bags 30-pack', quantity: 35, minQuantity: 10, price: 5, cost: 2, barcode: '50000004', category: Category.HOUSEHOLD },
    { name: 'Glass Cleaner 750ml', quantity: 25, minQuantity: 10, price: 4, cost: 2, barcode: '50000005', category: Category.HOUSEHOLD },
    { name: 'Shampoo 400ml', quantity: 30, minQuantity: 10, price: 7, cost: 3, barcode: '60000001', category: Category.BEAUTY },
    { name: 'Body Lotion 200ml', quantity: 20, minQuantity: 8, price: 9, cost: 4, barcode: '60000002', category: Category.BEAUTY },
    { name: 'Toothpaste 100ml', quantity: 45, minQuantity: 15, price: 4, cost: 2, barcode: '60000003', category: Category.BEAUTY },
    { name: 'Hand Soap 250ml', quantity: 60, minQuantity: 20, price: 3, cost: 1, barcode: '60000004', category: Category.BEAUTY },
    { name: 'Notebook A5', quantity: 80, minQuantity: 25, price: 3, cost: 1, barcode: '70000001', category: Category.OFFICE },
    { name: 'Ballpoint Pen 10-pack', quantity: 100, minQuantity: 30, price: 5, cost: 2, barcode: '70000002', category: Category.OFFICE },
    { name: 'Sticky Notes 3-pack', quantity: 65, minQuantity: 20, price: 4, cost: 2, barcode: '70000003', category: Category.OFFICE },
    { name: 'Folder 2-pocket', quantity: 50, minQuantity: 15, price: 2, cost: 1, barcode: '70000004', category: Category.OFFICE },
    { name: 'Storage Box 60L', quantity: 5, minQuantity: 10, price: 15, cost: 8, barcode: '80000001', category: Category.HARDWARE },
    { name: 'Screwdriver Set', quantity: 12, minQuantity: 5, price: 12, cost: 6, barcode: '80000002', category: Category.HARDWARE },
    { name: 'Hammer 500g', quantity: 8, minQuantity: 3, price: 10, cost: 5, barcode: '80000003', category: Category.HARDWARE },
    { name: 'Measuring Tape 5m', quantity: 20, minQuantity: 5, price: 6, cost: 3, barcode: '80000004', category: Category.HARDWARE },
    { name: 'Dog Food 2kg', quantity: 15, minQuantity: 5, price: 18, cost: 9, barcode: '90000001', category: Category.PET },
    { name: 'Cat Litter 5kg', quantity: 10, minQuantity: 5, price: 12, cost: 6, barcode: '90000002', category: Category.PET },
    { name: 'Pet Bowl Set', quantity: 22, minQuantity: 8, price: 8, cost: 4, barcode: '90000003', category: Category.PET },
  ]);

  const transactions = await transactionRepo.save([
    { userId: users[0].idU, Total: 15, created_at: new Date('2026-06-15') },
    { userId: users[1].idU, Total: 28, created_at: new Date('2026-06-16') },
    { userId: users[2].idU, Total: 9, created_at: new Date('2026-06-17') },
    { userId: users[0].idU, Total: 45, created_at: new Date('2026-06-18') },
    { userId: users[1].idU, Total: 12, created_at: new Date('2026-06-19') },
    { userId: users[2].idU, Total: 33, created_at: new Date('2026-06-20') },
    { userId: users[0].idU, Total: 22, created_at: new Date('2026-06-21') },
    { userId: users[1].idU, Total: 56, created_at: new Date('2026-06-22') },
    { userId: users[2].idU, Total: 18, created_at: new Date('2026-06-23') },
    { userId: users[0].idU, Total: 40, created_at: new Date('2026-06-24') },
  ]);

  await transactionItemRepo.save([
    { productId: products[0].idP, transactionId: transactions[0].idT, quantity: 3, unitPrice: 2 },
    { productId: products[6].idP, transactionId: transactions[0].idT, quantity: 2, unitPrice: 1 },
    { productId: products[8].idP, transactionId: transactions[0].idT, quantity: 4, unitPrice: 2 },
    { productId: products[11].idP, transactionId: transactions[1].idT, quantity: 2, unitPrice: 8 },
    { productId: products[13].idP, transactionId: transactions[1].idT, quantity: 1, unitPrice: 7 },
    { productId: products[30].idP, transactionId: transactions[1].idT, quantity: 2, unitPrice: 3 },
    { productId: products[16].idP, transactionId: transactions[2].idT, quantity: 1, unitPrice: 15 },
    { productId: products[6].idP, transactionId: transactions[3].idT, quantity: 10, unitPrice: 1 },
    { productId: products[20].idP, transactionId: transactions[3].idT, quantity: 5, unitPrice: 3 },
    { productId: products[21].idP, transactionId: transactions[3].idT, quantity: 2, unitPrice: 8 },
    { productId: products[2].idP, transactionId: transactions[4].idT, quantity: 6, unitPrice: 2 },
    { productId: products[27].idP, transactionId: transactions[5].idT, quantity: 3, unitPrice: 4 },
    { productId: products[16].idP, transactionId: transactions[5].idT, quantity: 1, unitPrice: 15 },
    { productId: products[25].idP, transactionId: transactions[5].idT, quantity: 2, unitPrice: 7 },
    { productId: products[8].idP, transactionId: transactions[6].idT, quantity: 5, unitPrice: 2 },
    { productId: products[30].idP, transactionId: transactions[6].idT, quantity: 4, unitPrice: 3 },
    { productId: products[11].idP, transactionId: transactions[7].idT, quantity: 3, unitPrice: 8 },
    { productId: products[14].idP, transactionId: transactions[7].idT, quantity: 1, unitPrice: 20 },
    { productId: products[33].idP, transactionId: transactions[7].idT, quantity: 2, unitPrice: 15 },
    { productId: products[20].idP, transactionId: transactions[8].idT, quantity: 6, unitPrice: 3 },
    { productId: products[8].idP, transactionId: transactions[9].idT, quantity: 8, unitPrice: 2 },
    { productId: products[17].idP, transactionId: transactions[9].idT, quantity: 1, unitPrice: 35 },
    { productId: products[28].idP, transactionId: transactions[9].idT, quantity: 2, unitPrice: 3 },
  ]);

  const provides = await provideRepo.save([
    { userId: users[3].idU, total: 120, created_at: new Date('2026-06-10') },
    { userId: users[4].idU, total: 200, created_at: new Date('2026-06-11') },
    { userId: users[3].idU, total: 85, created_at: new Date('2026-06-12') },
    { userId: users[4].idU, total: 150, created_at: new Date('2026-06-13') },
    { userId: users[3].idU, total: 300, created_at: new Date('2026-06-14') },
  ]);

  await provideItemRepo.save([
    { provideId: provides[0].idProvide, productId: products[0].idP, quantity: 50, unitPrice: 1 },
    { provideId: provides[0].idProvide, productId: products[6].idP, quantity: 100, unitPrice: 1 },
    { provideId: provides[0].idProvide, productId: products[8].idP, quantity: 80, unitPrice: 1 },
    { provideId: provides[1].idProvide, productId: products[11].idP, quantity: 60, unitPrice: 3 },
    { provideId: provides[1].idProvide, productId: products[12].idP, quantity: 50, unitPrice: 2 },
    { provideId: provides[1].idProvide, productId: products[13].idP, quantity: 30, unitPrice: 3 },
    { provideId: provides[1].idProvide, productId: products[14].idP, quantity: 20, unitPrice: 10 },
    { provideId: provides[2].idProvide, productId: products[20].idP, quantity: 70, unitPrice: 1 },
    { provideId: provides[2].idProvide, productId: products[21].idP, quantity: 40, unitPrice: 4 },
    { provideId: provides[2].idProvide, productId: products[22].idP, quantity: 60, unitPrice: 3 },
    { provideId: provides[3].idProvide, productId: products[16].idP, quantity: 50, unitPrice: 7 },
    { provideId: provides[3].idProvide, productId: products[17].idP, quantity: 20, unitPrice: 18 },
    { provideId: provides[3].idProvide, productId: products[18].idP, quantity: 10, unitPrice: 30 },
    { provideId: provides[3].idProvide, productId: products[25].idP, quantity: 30, unitPrice: 3 },
    { provideId: provides[4].idProvide, productId: products[30].idP, quantity: 100, unitPrice: 1 },
    { provideId: provides[4].idProvide, productId: products[31].idP, quantity: 120, unitPrice: 2 },
    { provideId: provides[4].idProvide, productId: products[32].idP, quantity: 80, unitPrice: 2 },
    { provideId: provides[4].idProvide, productId: products[33].idP, quantity: 60, unitPrice: 8 },
  ]);

  console.log('Seed completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
