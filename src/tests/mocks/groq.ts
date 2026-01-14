const mockCreate = jest.fn();

const groq = {
  chat: {
    completions: {
      create: mockCreate,
    },
  },
};

export default groq;
export { mockCreate };
