/*
 * This file is for reading the local outdoor temperature from the browser.
 */
type WeatherApiResponse = {
  current?: {
    temperature_2m?: number
  }
}

const getCurrentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not available in this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 10 * 60 * 1000,
    })
  })

export const fetchLocalTemperature = async () => {
  const position = await getCurrentPosition()
  const requestUrl = new URL('https://api.open-meteo.com/v1/forecast')

  requestUrl.searchParams.set('latitude', String(position.coords.latitude))
  requestUrl.searchParams.set('longitude', String(position.coords.longitude))
  requestUrl.searchParams.set('current', 'temperature_2m')
  requestUrl.searchParams.set('timezone', 'auto')

  const response = await fetch(requestUrl)

  if (!response.ok) {
    throw new Error('Could not fetch the local temperature')
  }

  const payload = (await response.json()) as WeatherApiResponse
  const temperatureCelsius = payload.current?.temperature_2m

  if (typeof temperatureCelsius !== 'number') {
    throw new Error('Local temperature data is missing')
  }

  return temperatureCelsius
}
