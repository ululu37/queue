// test/auth.test.js (หรือ adder.test.js)
import { describe, it, expect, vi ,beforeEach} from 'vitest';

// 1. ประกาศตัวแปรเพื่อเก็บ Mock Function ที่เราสร้างขึ้น
let mockAdd;

// 2. Mocking: จำลองการทำงานของไฟล์ '../util/cal'
vi.mock('../util/cal', () => {
  // สร้าง Mock Function และเก็บ Reference ไว้ในตัวแปรภายนอก
  mockAdd = vi.fn();
  
  // กำหนดพฤติกรรม: ให้ mockAdd ทำการบวกเพื่อคืนค่าผลลัพธ์
  mockAdd.mockImplementation((a, b) => a + b); 
  
  return { 
    add: mockAdd // ส่ง Mock Function นี้ไปยัง adder.js
  };
});

// 3. ต้องเรียกใช้ require หลังจาก vi.mock()
const { add1 } = require('../util/adder'); 
describe('add1', () => {

  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  it('ควรเรียกใช้ add(a, 1) และคืนค่าผลลัพธ์ที่ถูกต้อง', () => {
    // 1. จัดเตรียม (Arrange)
    const input = 5;
    const expected = 6;
    
    // 2. ปฏิบัติการ (Act)
    const result = add1(input);

    // 3. ตรวจสอบ (Assert)
    
    // ตรวจสอบค่าที่ถูกคืนกลับจาก add1
    expect(result).toBe(expected);
    
    // ใช้ mockAdd ที่เป็น Spy จริงๆ ในการตรวจสอบ
    expect(mockAdd).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledWith(input, 1);
  });
  
  it('ควรทำงานได้ถูกต้องเมื่ออินพุตเป็นศูนย์', () => {
    // 1. จัดเตรียม (Arrange)
    const input = 0;
    const expected = 1;
    
    // 2. ปฏิบัติการ (Act)
    const result = add1(input);

    // 3. ตรวจสอบ (Assert)
    expect(result).toBe(expected);
    expect(mockAdd).toHaveBeenCalledWith(input, 1); // ใช้ mockAdd
  });
  
  // Test case นี้ผ่านอยู่แล้ว เพราะใช้ vi.spyOn ถูกต้อง
  it('ควรพิมพ์ค่าอินพุตออกทาง console อย่างถูกต้อง', () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');
    
    // 2. ปฏิบัติการ (Act)
    add1(10);
    
    // 3. ตรวจสอบ (Assert)
    expect(consoleSpy).toHaveBeenCalledWith(10);
    
    // คืนค่า console.log เดิมกลับไป
    consoleSpy.mockRestore(); 
  });

});
