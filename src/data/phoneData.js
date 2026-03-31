// src/data/phoneData.js
// 휴대폰 샘플 데이터

const phones = [
  {
    phoneId: "PHONE001",
    name: "Galaxy S24 Ultra",
    brand: "삼성",
    category: "플래그십",
    unitPrice: 1698400,
    description: "삼성의 최신 플래그십 모델. S펜 내장, 200MP 카메라, 5000mAh 배터리",
    manufacturer: "삼성전자",
    unitsInStock: 50,
    releaseDate: "2024-01-17",
    condition: "new",
    filename: "galaxy-s24-ultra.jpg",
    specifications: {
      display: "6.8인치 Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "256GB",
      battery: "5000mAh",
      camera: "후면: 200MP+50MP+12MP+10MP, 전면: 12MP"
    },
    colors: ["티타늄 그레이", "티타늄 블랙", "티타늄 바이올렛"],
    reviewCount: 328,
    rating: 4.8,
    salesCount: 1250
  },
  {
    phoneId: "PHONE002",
    name: "iPhone 15 Pro Max",
    brand: "애플",
    category: "플래그십",
    unitPrice: 1990000,
    description: "애플의 최고급 모델. 티타늄 디자인, A17 Pro 칩, 5배 광학줌",
    manufacturer: "Apple Inc.",
    unitsInStock: 35,
    releaseDate: "2023-09-22",
    condition: "new",
    filename: "iphone-15-pro-max.jpg",
    specifications: {
      display: "6.7인치 Super Retina XDR",
      processor: "A17 Pro",
      ram: "8GB",
      storage: "256GB",
      battery: "4422mAh",
      camera: "후면: 48MP+12MP+12MP, 전면: 12MP"
    },
    colors: ["내추럴 티타늄", "블루 티타늄", "화이트 티타늄", "블랙 티타늄"],
    reviewCount: 542,
    rating: 4.9,
    salesCount: 2103
  },
  {
    phoneId: "PHONE003",
    name: "Galaxy Z Flip5",
    brand: "삼성",
    category: "폴더블",
    unitPrice: 1397000,
    description: "업그레이드된 폴더블 폰. 3.4인치 커버 스크린, 플렉스 힌지",
    manufacturer: "삼성전자",
    unitsInStock: 28,
    releaseDate: "2023-08-11",
    condition: "new",
    filename: "galaxy-z-flip5.jpg",
    specifications: {
      display: "6.7인치 (펼침) + 3.4인치 (커버)",
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "256GB",
      battery: "3700mAh",
      camera: "후면: 12MP+12MP, 전면: 10MP"
    },
    colors: ["그라파이트", "크림", "라벤더", "민트"],
    reviewCount: 189,
    rating: 4.6,
    salesCount: 687
  },
  {
    phoneId: "PHONE004",
    name: "Galaxy A54",
    brand: "삼성",
    category: "중급형",
    unitPrice: 548900,
    description: "합리적인 가격의 중급형 모델. 120Hz 디스플레이, 5000mAh 배터리",
    manufacturer: "삼성전자",
    unitsInStock: 120,
    releaseDate: "2023-03-24",
    condition: "new",
    filename: "galaxy-a54.jpg",
    specifications: {
      display: "6.4인치 Super AMOLED",
      processor: "Exynos 1380",
      ram: "8GB",
      storage: "128GB",
      battery: "5000mAh",
      camera: "후면: 50MP+12MP+5MP, 전면: 32MP"
    },
    colors: ["어썸 그라파이트", "어썸 라임", "어썸 바이올렛"],
    reviewCount: 456,
    rating: 4.5,
    salesCount: 3421
  },
  {
    phoneId: "PHONE005",
    name: "iPhone 14",
    brand: "애플",
    category: "중급형",
    unitPrice: 1250000,
    description: "검증된 성능의 아이폰. A15 Bionic 칩, 듀얼 카메라",
    manufacturer: "Apple Inc.",
    unitsInStock: 85,
    releaseDate: "2022-09-16",
    condition: "new",
    filename: "iphone-14.jpg",
    specifications: {
      display: "6.1인치 Super Retina XDR",
      processor: "A15 Bionic",
      ram: "6GB",
      storage: "128GB",
      battery: "3279mAh",
      camera: "후면: 12MP+12MP, 전면: 12MP"
    },
    colors: ["미드나이트", "퍼플", "스타라이트", "레드", "블루"],
    reviewCount: 1024,
    rating: 4.7,
    salesCount: 5689
  },
  {
    phoneId: "PHONE006",
    name: "Google Pixel 8 Pro",
    brand: "구글",
    category: "플래그십",
    unitPrice: 1350000,
    description: "구글의 최신 AI 폰. Tensor G3 칩, 최고의 카메라 성능",
    manufacturer: "Google LLC",
    unitsInStock: 42,
    releaseDate: "2023-10-12",
    condition: "new",
    filename: "pixel-8-pro.jpg",
    specifications: {
      display: "6.7인치 LTPO OLED",
      processor: "Google Tensor G3",
      ram: "12GB",
      storage: "256GB",
      battery: "5050mAh",
      camera: "후면: 50MP+48MP+48MP, 전면: 10.5MP"
    },
    colors: ["옵시디언", "포슬린", "베이"],
    reviewCount: 267,
    rating: 4.6,
    salesCount: 892
  },
  {
    phoneId: "PHONE007",
    name: "Galaxy S23 FE",
    brand: "삼성",
    category: "중급형",
    unitPrice: 796300,
    description: "플래그십 기능을 합리적인 가격에. 50MP 카메라, 무선충전",
    manufacturer: "삼성전자",
    unitsInStock: 95,
    releaseDate: "2023-10-05",
    condition: "new",
    filename: "galaxy-s23-fe.jpg",
    specifications: {
      display: "6.4인치 Dynamic AMOLED 2X",
      processor: "Exynos 2200",
      ram: "8GB",
      storage: "128GB",
      battery: "4500mAh",
      camera: "후면: 50MP+12MP+8MP, 전면: 10MP"
    },
    colors: ["크림", "그라파이트", "민트", "퍼플"],
    reviewCount: 178,
    rating: 4.4,
    salesCount: 1456
  },
  {
    phoneId: "PHONE008",
    name: "iPhone SE (3세대)",
    brand: "애플",
    category: "보급형",
    unitPrice: 650000,
    description: "가장 저렴한 아이폰. A15 Bionic 칩, 홈버튼 탑재",
    manufacturer: "Apple Inc.",
    unitsInStock: 150,
    releaseDate: "2022-03-18",
    condition: "new",
    filename: "iphone-se-3.jpg",
    specifications: {
      display: "4.7인치 Retina HD",
      processor: "A15 Bionic",
      ram: "4GB",
      storage: "64GB",
      battery: "2018mAh",
      camera: "후면: 12MP, 전면: 7MP"
    },
    colors: ["미드나이트", "스타라이트", "레드"],
    reviewCount: 892,
    rating: 4.3,
    salesCount: 4523
  }
];

// localStorage에 저장하는 함수
export const initPhoneData = () => {
  const existingData = localStorage.getItem('phones');
  if (!existingData) {
    localStorage.setItem('phones', JSON.stringify(phones));
    console.log('휴대폰 데이터 초기화 완료!');
  }
};

// 모든 휴대폰 가져오기
export const getAllPhones = () => {
  const data = localStorage.getItem('phones');
  return data ? JSON.parse(data) : [];
};

// ID로 휴대폰 찾기
export const getPhoneById = (phoneId) => {
  const phones = getAllPhones();
  return phones.find(phone => phone.phoneId === phoneId);
};

// 브랜드별 휴대폰 가져오기
export const getPhonesByBrand = (brand) => {
  const phones = getAllPhones();
  return phones.filter(phone => phone.brand === brand);
};

// 카테고리별 휴대폰 가져오기
export const getPhonesByCategory = (category) => {
  const phones = getAllPhones();
  return phones.filter(phone => phone.category === category);
};

// 검색
export const searchPhones = (keyword) => {
  const phones = getAllPhones();
  const lowerKeyword = keyword.toLowerCase();
  return phones.filter(phone => 
    phone.name.toLowerCase().includes(lowerKeyword) ||
    phone.brand.toLowerCase().includes(lowerKeyword) ||
    phone.description.toLowerCase().includes(lowerKeyword)
  );
};

// 정렬
export const sortPhones = (phones, sortBy) => {
  const sorted = [...phones];
  
  switch(sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.unitPrice - b.unitPrice);
    case 'price-desc':
      return sorted.sort((a, b) => b.unitPrice - a.unitPrice);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'reviews':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'sales':
      return sorted.sort((a, b) => b.salesCount - a.salesCount);
    case 'latest':
      return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    default:
      return sorted;
  }
};

export default phones;