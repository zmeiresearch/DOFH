/* Source file for the top-level executable - kypymypy */

#include <stdio.h>

#include "kyp1.h"
#include "kyp3.h"

int main(int argc, char ** argv)
{
	printf("Kypymypy starting up\n");

	printf("kyp1 says: %lf\n", kyp1_asd_global_func(42));
	printf("kyp1 also says: %d\n", kyp1_sdf_global_func(24));
	printf("kyp3 replies: %d\n", kyp3_global_func_1());
	printf("kyp3 reiterates: %lf\n", kyp3_global_func(2));

	return 0;
}

