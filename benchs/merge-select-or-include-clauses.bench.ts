import { describe, bench } from 'vitest';
import { mergeSelectOrIncludeClauses } from "../src/utils/merge-select-or-include-clauses";


describe("mergeSelectOrIncludeClauses()", () => {

  /**
   * This benchmark represents a "common" or "normal" usage of the 
   * mergeSelectOrIncludeClauses() method. 
   * p999 should be under 0.1ms
   */
  bench("normal usage", () => {
    mergeSelectOrIncludeClauses(
      {
        select: {
          firstName: true,
          lastName: true,
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
   * p999 should be under 0.2ms
   */;
  bench("unrealistic usage", () => {
    mergeSelectOrIncludeClauses(
      {
        include: {
          posts: true,
          comments: {
            select: {
              title: true,
              description: true,
              author: {
                include: {
                  user: {
                    include: {
                      posts: true,
                      comments: {
                        select: {
                          title: true,
                          description: true,
                          author: {
                            include: {
                              user: {
                                include: {
                                  posts: true,
                                  comments: {
                                    select: {
                                      title: true,
                                      description: true,
                                      author: {
                                        include: {
                                          user: true
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
            }
          },
          shares: {
            select: {
              title: true,
              description: true,
              author: {
                include: {
                  user: {
                    include: {
                      posts: true,
                      comments: {
                        select: {
                          title: true,
                          description: true,
                          author: {
                            include: {
                              user: {
                                include: {
                                  posts: true,
                                  comments: {
                                    select: {
                                      title: true,
                                      description: true,
                                      author: {
                                        include: {
                                          user: true
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
            }
          },
          related: {
            select: {
              title: true,
              description: true,
              author: {
                include: {
                  user: {
                    include: {
                      posts: true,
                      comments: {
                        select: {
                          title: true,
                          description: true,
                          author: {
                            include: {
                              user: {
                                include: {
                                  posts: true,
                                  comments: {
                                    select: {
                                      title: true,
                                      description: true,
                                      author: {
                                        include: {
                                          user: true
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
            }
          }
        }
      },
      {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          posts: {
            select: {
              title: true,
              content: true,
              comments: {
                include: {
                  author: true,
                  likes: {
                    select: {
                      author: {
                        select: {
                          firstName: true,
                          lastName: true,
                          email: true,
                          posts: {
                            select: {
                              title: true,
                              content: true,
                              comments: {
                                include: {
                                  author: true,
                                  likes: {
                                    select: {
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
                  }
                }
              },
              details: {
                include: {
                  comments: {
                    include: {
                      author: true,
                      likes: {
                        select: {
                          author: {
                            select: {
                              firstName: true,
                              lastName: true,
                              email: true,
                              posts: {
                                select: {
                                  title: true,
                                  content: true,
                                  comments: {
                                    include: {
                                      author: true,
                                      likes: {
                                        select: {
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
                      reports: {
                        select: {
                          author: {
                            select: {
                              firstName: true,
                              lastName: true,
                              email: true,
                              posts: {
                                select: {
                                  title: true,
                                  content: true,
                                  comments: {
                                    include: {
                                      author: true,
                                      likes: {
                                        select: {
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
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    );
  });
});