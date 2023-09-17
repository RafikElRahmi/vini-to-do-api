export function isExpired(
  expirationDate: Date = new Date("2023-08-18T14:21:22.021Z")
) {
  const newDate = new Date(Date.now() + 5 * 60 * 1000);
  const currentDate = new Date();
  const expiration = new Date(expirationDate);
  const next_send = expiration < currentDate;
  if (expiration > newDate) {
    return { new_next_send_time: expiration, next_send };
  } else {
    return { new_next_send_time: newDate, next_send };
  }
}

export function isCodeExpired(
  expirationDate: Date = new Date("2023-08-18T14:21:22.021Z")
) {
  const currentDate = new Date();
  const expiration = new Date(expirationDate);
  return expiration < currentDate;
}
export function dailyMails(daily: number) {
  if (daily <= 0) {
    return { daily: 0, dailyValid: false };
  }
  return { daily, dailyValid: true };
}

export function dailyLogged(daily: number = 0) {
  daily += 1;
  if (daily > 3) {
    return { daily, dailyValid: false };
  }
  return { daily, dailyValid: true };
}
export function setDailyExpires(
  expirationDate: Date = new Date("2023-08-18T14:21:22.021Z")
) {
  const newDate = new Date(Date.now() + 60 * 60 * 1000);
  if (expirationDate > newDate) {
    return { next_send_time: expirationDate };
  } else {
    return { next_send_time: newDate };
  }
}
