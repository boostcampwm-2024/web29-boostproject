import { parseSocketUrl } from './socket.util';

describe('parseSocketUrl', () => {
  it('유효한 URL에 대해 urlType과 urlId를 반환해야 한다', () => {
    const result = parseSocketUrl('/space/12345');
    expect(result).toEqual({ urlType: 'space', urlId: '12345' });
  });

  it('부분이 2개 미만인 URL에 대해 null을 반환해야 한다', () => {
    const result = parseSocketUrl('/invalid-format');
    expect(result).toEqual({ urlType: null, urlId: null });
  });

  it('빈 URL에 대해 null을 반환해야 한다', () => {
    const result = parseSocketUrl('');
    expect(result).toEqual({ urlType: null, urlId: null });
  });

  it('잘못된 형식의 URL에 대해 null을 반환해야 한다', () => {
    const result = parseSocketUrl('invalidurl');
    expect(result).toEqual({ urlType: null, urlId: null });
  });

  it('불필요한 슬래시를 포함한 URL도 정상적으로 처리해야 한다', () => {
    const result = parseSocketUrl('/space///12345/');
    expect(result).toEqual({ urlType: 'space', urlId: '12345' });
  });
});
