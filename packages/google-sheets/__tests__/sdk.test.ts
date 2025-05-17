import { GoogleSheetsSdk } from '../src/sdk';

describe('GoogleSheetsSdk - Utility Features', () => {
  const dummySdk = new GoogleSheetsSdk({
    clientId: 'test',
    clientSecret: 'test',
    accessToken: 'token',
    refreshToken: 'refresh',
  });

  it('should detect duplicate rows', async () => {
    const mockData = [
      ['Name', 'Age'],
      ['Alice', 25],
      ['Bob', 30],
      ['Alice', 25],
    ];
    jest.spyOn(dummySdk, 'getValues').mockResolvedValue(mockData);

    const duplicates = await dummySdk.detectDuplicateRows({ sheetId: 'sheet1', range: 'A1:B4' });
    expect(duplicates).toEqual([['Alice', 25]]);
  });

  it('should sanitize whitespace in data', async () => {
    const input = {
      range: { sheetId: 'sheet1', range: 'A1:C2' },
      values: [[' Alice ', ' 25 '], ['Bob', ' 30 ']],
    };

    const expectedSanitized = [['Alice', '25'], ['Bob', '30']];
    const updateSpy = jest
      .spyOn(dummySdk, 'updateValues')
      .mockResolvedValue({ spreadsheetId: 'sheet1', updatedCells: 4 });

    await dummySdk.sanitizeSheetData(input);
    expect(updateSpy).toHaveBeenCalledWith({
      range: input.range,
      values: expectedSanitized,
    });
  });
});
