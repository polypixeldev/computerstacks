type DateTimestamp = {
	timestamp: Date
}

type WithISOTimestamp<T> = T & {
	timestamp: string
}

export function computeISOTimestamp<Data extends DateTimestamp>(
	data: Data
): WithISOTimestamp<Data> {
	return {
		...data,
		timestamp: data.timestamp.toISOString(),
	}
}