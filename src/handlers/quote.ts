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

export const createQuote = async (req, res, next) => {
  try {
    const quote = await prisma.quote.create({
      data: {
        text: req.body.text,
        createdBy: {
          connect: {
            username: req.user.username,
          },
        },
        author: {
          // connect to author if already exists, otherwise create a new one
          connectOrCreate: {
            where: { name: req.body.author },
            create: { name: req.body.author },
          },
        },
      },
    });

    res.status(201).json({ data: quote });
  } catch (e) {
    next(e);
  }
};

export const updateQuote = async (req, res, next) => {
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
    next(e);
  }
};

export const deleteQuote = async (req, res, next) => {
  try {
    const deletedQuote = await prisma.quote.delete({
      where: {
        id_createdByUserId: {
          id: req.params.id,
          createdByUserId: req.user.id,
        },
      },
    });

    res.status(200).json({ data: deletedQuote });
  } catch (e) {
    next(e);
  }
};
