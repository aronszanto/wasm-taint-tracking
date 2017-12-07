
// x should have a full taint from n.
int test0(int n) {
  int x = 0;
  while (n > 1) {
    x *= n;
  }
  return x;
}

// x should have a direct taint from n
int test1(int n) {
  int x = 2 + n;
  return x;
}

// x should have an indirect taint from n
int test2(int n) {
  int x = 1;
  if (n > 0) {
    x = -1;
  }
  return x;
}

// x should have a direct taint from a and no taint from b
int test3(int a, int b) {
  int x = a + 3;
  b += 3;
  return x;
}

// x should have a direct taint from a and an indirect taint from b
int test4(int a, int b) {
  int x = a + 3;
  if (b > 0) {
    x++;
  }
  return x;
}
