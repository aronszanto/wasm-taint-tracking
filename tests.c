
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
  nodes[b].val = a;
  nodes[b].next = 0;
  int x = 0;
  struct node *head = &nodes[0];
  while (head != 0) {
    x += head->val;
    head = head->next;
  }
  return x;
}

// x should be directly tainted by a
short test6(long long a) {
  short x = (short) a;
  return x;
}

// x should be directly tainted by a
int test7(long long a) {
  int x = (int) a;
  return x;
}

// x should be directly tainted by a and b
long long test8(long long a, long long b) {
  long long x = a + b;
  return x;
}

// x should be directly tainted by a
long long test9(long long a) {
  long long x = 1;
  for(; a > 0; a --) {
    x *= a;
  }
  return x;
}

int gcd(int a, int b)
{
    if (a == 0)
        return b;
    return gcd(b%a, a);
}
 
// A simple method to evaluate Euler Totient Function
int test10(unsigned int n)
{
    unsigned int result = 1;
    for (int i=2; i < n; i++)
        if (gcd(i, n) == 1)
            result++;
    return result;
}

int test11(int n)
{    
    int result = n;   // Initialize result as n
 
    // Consider all prime factors of n and subtract their
    // multiples from result
    for (int p=2; p*p<=n; ++p)
    {
        // Check if p is a prime factor.
        if (n % p == 0)
        {
            // If yes, then update n and result 
            while (n % p == 0)
                n /= p;
            result -= result / p;
        }
    }
 
    // If n has a prime factor greater than sqrt(n)
    // (There can be at-most one such prime factor)
    if (n > 1)
        result -= result / n;
    return result;
}
