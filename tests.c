// x should have a full taint from n.
int test0(int n) {
  int x = 1;
  while (n > 1) {
    x *= n;
    n--;
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

struct node {
  struct node *next;
  int val;
};

// x should have a direct taint from a and an indirect taint from b if b <= a OR an indirect taint from a and b if b > a
int test5(int a, int b) {
  struct node nodes[a];
  if (b > a) {
    return -1;
  }
  for (int i = 0; i < b; i++) {
    nodes[i].val = a;
    nodes[i].next = &nodes[i+1];
  }
  nodes[9].val = a;
  nodes[0].next = 0;
  int x = 0;
  struct node *head = &nodes[0];
  while (head != 0) {
    x += head->val;
    head = head->next;
  }
  return x;
}

