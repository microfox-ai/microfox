import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleSheetsSdk,
  Range,
  UpdateValuesInput,
  //AppendValuesInput,
} from '@microfox/google-sheets';

interface Tokens {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  isValid: boolean;
}

interface SheetsProps {
  tokens: Tokens;
}

interface SpreadsheetData {
  values: any[][];
  headers: string[];
}

export default function Sheets({ tokens }: SheetsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [range, setRange] = useState('A1:Z100');
  const [spreadsheetData, setSpreadsheetData] =
    useState<SpreadsheetData | null>(null);
  const [operation, setOperation] = useState<'read' | 'update' | 'append'>(
    'read',
  );
  const [updateData, setUpdateData] = useState<string>('');
  const [operationResult, setOperationResult] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to validate JSON format
  const validateJsonFormat = (
    jsonString: string,
  ): { isValid: boolean; error?: string; data?: any[][] } => {
    try {
      const data = JSON.parse(jsonString);

      // Check if it's an array
      if (!Array.isArray(data)) {
        return { isValid: false, error: 'Data must be an array' };
      }

      // Check if all elements are arrays
      if (!data.every(item => Array.isArray(item))) {
        // If not all elements are arrays, try to convert to 2D array
        if (
          data.length > 0 &&
          typeof data[0] === 'object' &&
          !Array.isArray(data[0])
        ) {
          // This might be an array of objects (like from get_all_records())
          // Convert to 2D array with headers as first row
          const headers = Object.keys(data[0]);
          const rows = data.map(item => headers.map(header => item[header]));
          return { isValid: true, data: [headers, ...rows] };
        }
        return {
          isValid: false,
          error: 'All elements must be arrays or objects',
        };
      }

      // Check if all inner arrays have the same length
      const firstLength = data[0]?.length || 0;
      if (data.some(item => item.length !== firstLength)) {
        return {
          isValid: false,
          error: 'All rows must have the same number of columns',
        };
      }

      return { isValid: true, data };
    } catch (error) {
      return { isValid: false, error: 'Invalid JSON format' };
    }
  };

  // Helper function to ensure UTF-8 encoding
  const ensureUtf8Encoding = (data: any[][]): any[][] => {
    return data.map(row =>
      row.map(cell => {
        if (typeof cell === 'string') {
          // Encode to UTF-8 if it's a string
          return encodeURIComponent(cell);
        }
        return cell;
      }),
    );
  };

  // Helper function to convert data to 2D array format
  const convertTo2DArray = (data: any): any[][] => {
    if (Array.isArray(data)) {
      if (
        data.length > 0 &&
        typeof data[0] === 'object' &&
        !Array.isArray(data[0])
      ) {
        // Array of objects (like from get_all_records())
        const headers = Object.keys(data[0]);
        return [
          headers,
          ...data.map(item => headers.map(header => item[header])),
        ];
      } else if (data.every(item => Array.isArray(item))) {
        // Already a 2D array
        return data;
      }
    }
    // Default case: wrap in a 2D array
    return [[data]];
  };

  const handleOperation = async () => {
    if (!tokens.isValid || !tokens.accessToken || !tokens.refreshToken) {
      setError('Invalid tokens. Please authenticate again.');
      navigate('/');
      return;
    }

    if (!spreadsheetId || !sheetName || !range) {
      setError('Please provide spreadsheet ID, sheet name, and range');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOperationResult(null);

      const clientId = localStorage.getItem('clientId1');
      const clientSecret = localStorage.getItem('clientSecret1');

      // Initialize the Google Sheets SDK
      const sheetsSdk = new GoogleSheetsSdk({
        clientId: clientId || '', // This is required by the SDK but not used for API calls
        clientSecret: clientSecret || '', // This is required by the SDK but not used for API calls
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      const formattedRange = `${sheetName}!${range}`;
      const rangeObj: Range = {
        sheetId: spreadsheetId,
        range: formattedRange,
      };

      if (operation === 'read') {
        // Read operation
        const values = await sheetsSdk.getValues(rangeObj);
        const headers = values.length > 0 ? values[0] : [];

        setSpreadsheetData({
          values,
          headers,
        });

        setOperationResult('Data read successfully');
      } else if (operation === 'update') {
        // Update operation
        if (!updateData) {
          setError('Please provide data to update');
          return;
        }

        const validation = validateJsonFormat(updateData);
        if (!validation.isValid || !validation.data) {
          setError(
            `Invalid data format: ${validation.error}. Please provide data in the format: [["Header1", "Header2"], ["Value1", "Value2"]]`,
          );
          return;
        }

        const updateInput: UpdateValuesInput = {
          range: rangeObj,
          values: validation.data,
        };

        const response = await sheetsSdk.updateValues(updateInput);
        setOperationResult(
          `Data updated successfully. Updated ${response.updatedCells || 'unknown number of'} cells.`,
        );
      } else if (operation === 'append') {
        // Append operation
        if (!updateData) {
          setError('Please provide data to append');
          return;
        }

        const validation = validateJsonFormat(updateData);
        if (!validation.isValid || !validation.data) {
          setError(
            `Invalid data format: ${validation.error}. Please provide data in the format: [["Header1", "Header2"], ["Value1", "Value2"]]`,
          );
          return;
        }

        // Ensure data is in 2D array format
        const twoDArrayData = convertTo2DArray(validation.data);

        // Ensure UTF-8 encoding for all string values
        const encodedData = ensureUtf8Encoding(twoDArrayData);

        const data = await sheetsSdk.appendValues({
          range: rangeObj,
          values: encodedData,
        });

        setOperationResult(
          `Data appended successfully. Updated ${data.updatedCells || 'unknown number of'} cells.`,
        );
      }
    } catch (err) {
      console.error(`Error performing ${operation} operation:`, err);
      setError(`Failed to ${operation} spreadsheet data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sheets-container">
      <h2>Google Sheets Operations</h2>

      <div className="operation-form">
        <div className="form-group">
          <label htmlFor="spreadsheetId">Spreadsheet ID:</label>
          <input
            id="spreadsheetId"
            type="text"
            value={spreadsheetId}
            onChange={e => setSpreadsheetId(e.target.value)}
            placeholder="Enter spreadsheet ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sheetName">Sheet Name:</label>
          <input
            id="sheetName"
            type="text"
            value={sheetName}
            onChange={e => setSheetName(e.target.value)}
            placeholder="Enter sheet name (e.g., Sheet1)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="range">Range:</label>
          <input
            id="range"
            type="text"
            value={range}
            onChange={e => setRange(e.target.value)}
            placeholder="Enter range (e.g., A1:Z100)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="operation">Operation:</label>
          <select
            id="operation"
            value={operation}
            onChange={e =>
              setOperation(e.target.value as 'read' | 'update' | 'append')
            }
          >
            <option value="read">Read</option>
            <option value="update">Update</option>
            <option value="append">Append</option>
          </select>
        </div>

        {(operation === 'update' || operation === 'append') && (
          <div className="form-group">
            <label htmlFor="updateData">Data (JSON array):</label>
            <textarea
              id="updateData"
              value={updateData}
              onChange={e => setUpdateData(e.target.value)}
              placeholder='[["Header1", "Header2"], ["Value1", "Value2"]]'
              rows={5}
            />
            <div className="data-format-help">
              <p>Format: JSON array of arrays. Example:</p>
              <pre>[["Header1", "Header2"], ["Value1", "Value2"]]</pre>
            </div>
          </div>
        )}

        <button onClick={handleOperation} disabled={loading}>
          {loading ? 'Processing...' : `Perform ${operation} operation`}
        </button>
      </div>

      {operationResult && (
        <div className="operation-result">
          <p className="success">{operationResult}</p>
        </div>
      )}

      {error && (
        <div className="operation-error">
          <p className="error">{error}</p>
        </div>
      )}

      {spreadsheetData && (
        <div className="spreadsheet-data">
          <h3>Spreadsheet Data</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {spreadsheetData.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spreadsheetData.values.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
