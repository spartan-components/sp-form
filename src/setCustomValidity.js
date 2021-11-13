const getParams = (text) => {
  const params = [];
  const regex = /{([^}]+)}/g;
  let curMatch = [];
  
  // eslint-disable-next-line no-cond-assign
  while ((curMatch = regex.exec(text)) !== null) {
    params.push(curMatch[0]);
  }

  return params;
}

const setInterpolatedValidity = (field, text) => {

  const params = getParams(text);
  
  let resolvedText = text;

  const resolvedValues = params.map(param => {
    let value = '';

    if (param === "{field}") {
      value = field.labels[0].innerText;
    } else {
      const stripped = param.replace("{", "").replace("}", "");
      value = field.getAttribute(stripped);
    }

    return {
      key: param,
      value
    };
  });

  
  resolvedValues.forEach(param => {
    resolvedText = resolvedText.replace(param.key, param.value);
  })
  
  field.setCustomValidity(resolvedText);

}

const setCustomValidity = (field, hints) => {
  const { validity } = field;

  if (validity.valueMissing) {
    setInterpolatedValidity(field ,hints.required)
  } else if (validity.rangeOverflow) {
    setInterpolatedValidity(field ,hints.overflow)
  } else if (validity.rangeUnderflow) {
    setInterpolatedValidity(field ,hints.underflow)
  } else if (validity.typeMismatch && field.type === 'email') {
    setInterpolatedValidity(field ,hints.email)
  }

  
}

export { setCustomValidity };