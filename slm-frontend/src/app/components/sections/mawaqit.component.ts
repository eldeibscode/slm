import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from '../ui/container.component';
import { siteConfig } from '@/config/site.config';

@Component({
  selector: 'app-mawaqit',
  standalone: true,
  imports: [CommonModule, ContainerComponent],
  template: `
    <section [id]="mawaqitConfig.id" class="py-12 md:py-16 lg:py-20 bg-white">
      <ui-container>
        <!--        &lt;!&ndash; Section Header &ndash;&gt;-->
        <!--        <div class="text-center max-w-3xl mx-auto mb-12">-->
        <!--          <h2 class="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">-->
        <!--            {{ mawaqitConfig.title }}-->
        <!--          </h2>-->
        <!--          <p class="text-lg text-secondary-600">-->
        <!--            {{ mawaqitConfig.description }}-->
        <!--          </p>-->
        <!--        </div>-->

        <div class="w-full">
          <!-- Desktop/Big Screen iframe -->
          <iframe
            src="//mawaqit.net/it/w/salam-forderverein-e-v-bonn-53179-germany?showOnly5PrayerTimes=0"
            frameborder="0"
            scrolling="no"
            class="widget hidden md:block w-full h-[600px] md:h-[700px] lg:h-[800px] rounded-lg shadow-lg"
            title="Mawaqit Prayer Times"
            loading="lazy"
          ></iframe>

          <!-- Mobile/Small Screen iframe -->
          <iframe
            src="//mawaqit.net/it/m/salam-forderverein-e-v-bonn-53179-germany?showNotification=0&showSearchButton=0&showFooter=0&showFlashMessage=0&view=mobile"
            frameborder="0"
            scrolling="no"
            class="mobile block md:hidden w-full h-[600px] rounded-lg shadow-lg"
            title="Mawaqit Prayer Times"
            loading="lazy"
          ></iframe>
        </div>
      </ui-container>
    </section>
  `,
})
export class MawaqitComponent {
  mawaqitConfig = siteConfig.mawaqit;
}
