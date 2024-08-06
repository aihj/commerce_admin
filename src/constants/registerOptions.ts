interface RegisterOptionsType {
  affiliation?: string; // 소속명
  license?: string; // 면허번호
  major_subject?: string; // 전공과목
}

enum RegisterOptions {
  affiliation = 'affiliation',
  license = 'license',
  major_subject = 'major_subject',
}

export { RegisterOptions };
export type { RegisterOptionsType };
