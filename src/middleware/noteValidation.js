const noteValidation = (req, res, next) => {
  const { date, description, title } = req.body;
  //   For checking the date format
  const pattern = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof date !== "string"
  ) {
    return res.status(400).send("Bad Request");
  }

  if (title.trim().length === 0 || description.trim().length === 0) {
    return res.status(400).send("Empty");
  }

  if (title.length > 50 || title.length < 5) {
    return res.status(400).send("Title length allowed (5-50)");
  }

  if (description.length > 200 || description.length < 5) {
    return res.status(400).send("Description length allowed (5-200)");
  }

  if (!pattern.test(date)) {
    return res.status(400).send("Bad date format");
  }

  const now = Date.now();
  const later = new Date(date).getTime();
  const diff = later - now;

  // later set to 15min
  if (diff < 0) {
    return res.status(400).send("Mininum requirement: more than current time");
  }

  next();
};

module.exports = noteValidation;
