

export function toEqualSet<T> (received: Set<T>, expected: Set<T>) {
  const { isNot } = this;

  const missingValues: T[] = [];
  const unwantedValues: T[] = [];

  for (const value of expected) {
    if (!received.has(value)) missingValues.push(value);
  }

  for (const value of received) {
    if (!expected.has(value)) unwantedValues.push(value);
  }

  if (!missingValues.length && !unwantedValues.length) {
    return {
      pass: true,
      message: () => ""
    };
  }
  else {
    let message = "";
    if (missingValues.length) {
      message += `\nThe received Set misses ${missingValues.length} value(s) from the expected one:`;
      for (const value of missingValues) message += "\n- " + value;
      message += "\n";
    }
    if (unwantedValues.length) {
      message += `\nThe received Set contains ${unwantedValues.length} additional value(s) not found in the expected one:`;
      for (const value of unwantedValues) message += "\n- " + value;
      message += "\n";
    }
    return {
      pass: false,
      message: () => message
    };
  }
}
