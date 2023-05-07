import { describe, bench } from 'vitest';
import { mergeSelectOrIncludeClauses } from "../src/utils/merge-select-or-include-clauses";


describe("mergeSelectOrIncludeClauses()", () => {

  /**
   * This benchmark represents a "common" or "normal" usage of the 
   * mergeSelectOrIncludeClauses() method. 
   * p999 should be under 0.1ms (on my machine)
   */
  bench("normal usage", () => {
    mergeSelectOrIncludeClauses(
      "user",
      {
        select: {
          name: true,
          email: true,
          posts: {
            select: {
              title: true,
              content: true
            }
          }
        }
      },
      {
        include: {
          posts: {
            select: {
              title: true,
              comments: {
                include: {
                  message: true,
                }
              }
            }
          }
        }
      }
    );
  });

  /** 
   * This benchmark represents a "unrealistic" or "extreme" usage of the
   * mergeSelectOrIncludeClauses() method.
   * It is here to ensure that the method performs well even in such
   * extreme cases where gigantic clauses bodies are merged together.
   * p999 should be under 0.3ms (on my machine)
   */;
  bench("unrealistic usage", () => {
    mergeSelectOrIncludeClauses(
      "user",
      {
        include: {
          posts: true,
          comments: {
            select: {
              title: true,
              content: true,
              author: {
                include: {
                  posts: true,
                  comments: {
                    select: {
                      message: true,
                      createAt: true,
                      author: {
                        include: {
                          posts: true,
                          comments: {
                            select: {
                              message: true,
                              createdAt: true,
                              author: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          friends: {
            include: {
              profile: {
                select: {
                  bio: true,
                  age: true,
                }
              },
              posts: true,
              comments: true,
              friends: {
                select: {
                  name: true,
                  profile: {
                    select: {
                      bio: true,
                      user: {
                        include: {
                          posts: true,
                          comments: {
                            select: {
                              title: true,
                              content: true,
                              author: {
                                include: {
                                  posts: true,
                                  comments: {
                                    select: {
                                      message: true,
                                      createAt: true,
                                      author: {
                                        include: {
                                          posts: true,
                                          comments: {
                                            select: {
                                              message: true,
                                              createdAt: true,
                                              author: true
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          },
                          friends: {
                            include: {
                              profile: {
                                select: {
                                  bio: true,
                                  age: true,
                                }
                              },
                              posts: true,
                              comments: true,
                              friends: {
                                select: {
                                  name: true,
                                  profile: {
                                    select: {
                                      bio: true
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
      {
        select: {
          profile: {
            select: {
              bio: true,
              isPrivate: true
            }
          },
          comments: {
            select: {
              createdAt: true,
              author: {
                include: {
                  friends: {
                    include: {
                      profile: {
                        select: {
                          bio: true,
                          age: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          friends: {
            select: {
              id: true,
              email: true,
              name: true,
              profileId: true,
              profile: {
                select: {
                  bio: true,
                  isPrivate: true
                }
              },
              comments: {
                select: {
                  createdAt: true,
                  author: {
                    include: {
                      friends: {
                        include: {
                          profile: {
                            select: {
                              bio: true,
                              age: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              friends: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                  profileId: true
                }
              }
            }
          }
        }
      }
    );
  });
});