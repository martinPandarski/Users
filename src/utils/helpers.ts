const validArray = (arr: unknown[] | undefined | null) => {
  return arr !== undefined && Array.isArray(arr) && arr.length > 0;
};

function validString(str: string | undefined): boolean {
  return str !== undefined && str.trim() !== "";
}

function validNumber(num: number | undefined): boolean {
  return num !== undefined && !isNaN(num) && num > 0;
}

function validBoolean(bool: boolean | undefined): boolean {
  return bool !== undefined;
}

export { validArray, validString, validBoolean, validNumber };
