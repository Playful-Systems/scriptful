export const getCommand = () => {
  const args = process.argv;
  const command = args[2];
  return command;
};
