import prisma from '../db';

export const getAllQuotes = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      quotes: true,
    },
  });

  res.json({ data: user.quotes });
};

export const getOneQuote = async (req, res) => {
  const { id } = req.params;

  const quote = await prisma.quote.findFirst({
    where: {
      id,
      createdByUserId: req.user.id,
    },
  });

  res.json({ data: quote });
};

export const createQuote = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.user.username,
      },
    });

    const quote = await prisma.quote.create({
      data: {
        createdByUserId: user.id,
        text: req.body.text,
        author: req.body.author,
      },
    });

    res.status(201).json({ data: quote });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'unable to create new quote' });
  }
};

export const updateQuote = async (req, res) => {
  const { text, author } = req.body;

  let data;

  if (text && author) {
    data = {
      text,
      author,
    };
  } else if (text) {
    data = {
      text,
    };
  } else {
    data = {
      author,
    };
  }

  try {
    const updatedQuote = await prisma.quote.update({
      where: {
        id_createdByUserId: {
          id: req.params.id,
          createdByUserId: req.user.id,
        },
      },
      data,
    });

    res.status(201).json({ data: updatedQuote });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'unable to update quote' });
  }
};

export const deleteQuote = async (req, res) => {
  const deletedQuote = await prisma.quote.delete({
    where: {
      id_createdByUserId: {
        id: req.params.id,
        createdByUserId: req.user.id,
      },
    },
  });

  res.status(200).json({ data: deletedQuote });
};
